const crypto = require('crypto');
const z = require('zod');

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}
exports.HttpError = HttpError;

/**
 * @template { z.ZodType } T
 * @param { any } data
 * @param { T } schema
 */
exports.validatedBody = (data, schema) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid request body');
  }
  return parsed.data;
}


/**
 * @typedef { import('express').RequestHandler } RequestHandler
 */