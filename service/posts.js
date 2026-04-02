const z = require('zod');

const auth = require('./auth');
const db = require('./database');
const utils = require('./utils');
const { broadcast } = require('./websocket');
const { HttpError, validatedBody } = utils;

const createSchema = z.object({
  title: z.string(),
  content: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  expirationDate: z.iso.datetime()
});
/** @type { utils.RequestHandler } */
exports.create = async (req, res) => {
  const { title, content, coordinates, expirationDate } = validatedBody(req.body, createSchema);

  const username = await auth.requireAuth(req.headers['authorization']);
  const id = title.toLowerCase().replace(/\s+/g, '-').slice(0, 30) + '-' + Math.random().toString(36).slice(2, 9);

  const post = {
    id,
    title,
    content,
    coordinates,
    username,
    createdDate: new Date(),
    expirationDate: new Date(expirationDate)
  }

  await db.posts.insert(post);
  res.send(post);
  
  broadcast('new_posts', post);
}

/** @type { utils.RequestHandler } */
exports.get = async (req, res) => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    throw new HttpError(400, 'Invalid post ID');
  }

  const post = await db.posts.get(id);
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  res.send(post);
}

exports.all = async (req, res) => {
  const allPosts = await db.posts.all();
  res.send(allPosts);
}

setInterval(() => db.posts.deleteExpired(), 60 * 1000); // Check every minute