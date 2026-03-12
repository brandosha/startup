const z = require('zod');

const auth = require('./auth');
const utils = require('./utils');
const { HttpError, validatedBody } = utils;


/**
 * @type {Object.<string, { 
 *   title: string,
 *   content: string,
 *   username: string,
 *   coordinates: { latitude: number, longitude: number },
 *   postId: string,
 *   createdDate: Date,
 *   expirationDate: Date
 * }>} postsData
 */
const postsData = {
  // postId: { title, content, username, coordinates: { latitude, longitude }, postId, createdDate, expirationDate }
}

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

  const username = auth.requireAuth(req.headers['authorization']);
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

  postsData[id] = post;

  res.send(post);
}

/** @type { utils.RequestHandler } */
exports.get = async (req, res) => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    throw new HttpError(400, 'Invalid post ID');
  }

  const post = postsData[id];
  if (!post) {
    throw new HttpError(404, 'Post not found');
    return;
  }

  res.send(post);
}

exports.all = async (req, res) => {
  const allPosts = Object.values(postsData);
  res.send(allPosts);
}

setInterval(() => {
  const now = new Date();
  for (const id in postsData) {
    if (postsData[id].expirationDate < now) {
      delete postsData[id];
    }
  }
}, 60 * 1000); // Check every minute