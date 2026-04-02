const z = require('zod');

const auth = require('./auth');
const db = require('./database');
const utils = require('./utils');
const { broadcast } = require('./websocket');
const { HttpError, validatedBody } = utils;

const createSchema = z.object({
  postId: z.string(),
  content: z.string()
});
/** @type { utils.RequestHandler } */
exports.create = async (req, res) => {
  const { postId, content } = validatedBody(req.body, createSchema);

  const username = await auth.requireAuth(req.headers['authorization']);
  const post = await db.posts.get(postId);
  if (!post || post.expirationDate < new Date()) {
    throw new HttpError(404, 'Post not found');
  }

  const comment = {
    postId,
    username,
    content,
    createdDate: new Date()
  };

  await db.comments.insert(comment);
  res.send(comment);

  broadcast(postId + '/comments', comment);
}

/** @type { utils.RequestHandler } */
exports.get = async (req, res) => {
  const { postId } = req.query;
  if (typeof postId !== 'string') {
    throw new HttpError(400, 'Invalid post ID');
  }

  const comments = await db.comments.get(postId);
  res.send(comments);
}