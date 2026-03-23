const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const z = require('zod');

const db = require('./database');
const utils = require('./utils');
const { HttpError, validatedBody } = utils;

const SESSION_COOKIE = 'session';
const setNewAuthCookie = (res, username) => new Promise((resolve, reject) => {
  crypto.randomBytes(16, async (err, buffer) => {
    if (err) {
      console.error('Error generating token:', err);
      reject(new HttpError(500, 'Internal Server Error'));
      return;
    }

    const authToken = buffer.toString('base64');
    await db.sessions.insert({ token: authToken, username });
    res.cookie(SESSION_COOKIE, authToken, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });

    resolve(authToken);
  });
});

const registerSchema = z.object({
  username: z.string(),
  password: z.string()
});
/** @type { utils.RequestHandler } */
exports.register = async (req, res) => {
  const { username, password } = validatedBody(req.body, registerSchema);

  if (await db.users.get(username)) {
    throw new HttpError(409, 'Username is taken');
  }

  const passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  await db.users.insert({ username, passwordHash });

  const authToken = await setNewAuthCookie(res, username);
  res.send({
    user: { username },
    authToken
  });
}


const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});
/** @type { utils.RequestHandler } */
exports.login = async (req, res) => {
  const { username, password } = validatedBody(req.body, loginSchema);

  const user = await db.users.get(username);
  if (!user) {
    throw new HttpError(401, 'Invalid username or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new HttpError(401, 'Invalid username or password');
  }

  const authToken = await setNewAuthCookie(res, username);
  res.send({
    user: { username },
    authToken
  });
}

exports.logout = async (req, res) => {
  const authToken = req.headers['authorization'];
  await db.sessions.delete(authToken);
  res.clearCookie(SESSION_COOKIE);
  res.send({});
}

/** @type { utils.RequestHandler } */
exports.me = async (req, res) => {
  const authToken = req.headers['authorization'];
  // const { authToken } = validatedBody(req.body, meSchema);
  const session = await db.sessions.get(authToken);
  const username = session?.username;
  if (!username) {
    throw new HttpError(401, 'Not authenticated');
  }

  res.send({ username });
}

exports.requireAuth = async (authToken) => {
  const session = await db.sessions.get(authToken);
  const username = session?.username;
  if (!username) {
    throw new HttpError(401, 'Not authenticated');
  }

  return username;
}