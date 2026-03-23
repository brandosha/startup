const z = require('zod');

const auth = require('./auth');
const utils = require('./utils');
const { HttpError, validatedBody } = utils;

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
exports.create = async (req, res) => {
  const { postId, content } = validatedBody(req.body, createSchema);

  const username = await auth.requireAuth(req.headers['authorization']);
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
    throw new HttpError(400, 'Invalid post ID');
  }

  res.send(commentsData[postId] || []);
}

exports.commentsData = commentsData;