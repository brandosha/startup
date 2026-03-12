const cookieParser = require('cookie-parser');
const express = require('express');
const { HttpError } = require('./src/utils');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Service listening on port ${port}`);
});

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

const auth = require('./src/auth');
apiRouter.post('/auth/register', auth.register);
apiRouter.post('/auth/login', auth.login);
apiRouter.delete('/auth/logout', auth.logout);
apiRouter.get('/auth/me', auth.me);

const posts = require('./src/posts');
apiRouter.post('/posts/create', posts.create);
apiRouter.get('/posts/get', posts.get);
apiRouter.get('/posts/all', posts.all);


app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      type: err.name,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      type: 'Internal Server Error',
      message: 'Internal Server Error',
    });
  }
});
