const auth = require('./auth');
const utils = require('./utils');
const z = require('zod');

/**
 * @type {
 *   Object.<string, { 
 *     title: string,
 *     content: string,
 *     username: string,
 *     coordinates: { latitude: number, longitude: number },
 *     postId: string,
 *     createdDate: Date,
 *     expirationDate: Date
 *   }>
 * } postData
 */
const postData = {
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
  const { title, content, coordinates, expirationDate } = utils.validatedBody(req.body, createSchema);

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

  postData[id] = post;

  res.send(post);
}

/** @type { utils.RequestHandler } */
exports.get = async (req, res) => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid post ID' });
    return;
  }

  const post = postData[id];
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  res.send(post);
}

exports.all = async (req, res) => {
  const allPosts = Object.values(postData);
  res.send(allPosts);
}

setInterval(() => {
  const now = new Date();
  for (const id in postData) {
    if (postData[id].expirationDate < now) {
      delete postData[id];
    }
  }
}, 60 * 1000); // Check every minute