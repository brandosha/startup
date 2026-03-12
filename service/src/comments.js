const auth = require('./auth');
const utils = require('./utils');
const z = require('zod');

/**
 * @type {Object<string, Array<{
 *   postId: string,
 *   username: string,
 *   content: string,
 *   createdDate: Date
 * }>>}
 */
const commentsData = {
  // postid: [ { postId, username, content, createdDate } ]
}

const createSchema = z.object({
  postId: z.string(),
  content: z.string()
});
/** @type { utils.RequestHandler } */
exports.create = (req, res) => {
  const { postId, content } = utils.validatedBody(req.body, createSchema);

  const username = auth.requireAuth(req.headers['authorization']);
  const comment = {
    postId,
    username,
    content,
    createdDate: new Date()
  };

  if (!commentsData[postId]) {
    commentsData[postId] = [];
  }

  commentsData[postId].push(comment);
  res.send(comment);
}

/** @type { utils.RequestHandler } */
exports.get = (req, res) => {
  const { postId } = req.query;
  if (typeof postId !== 'string') {
    res.status(400).json({ message: 'Invalid post ID' });
    return;
  }

  res.send(commentsData[postId] || []);
}