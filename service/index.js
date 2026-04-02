const cookieParser = require('cookie-parser');
const express = require('express');
const { HttpError } = require('./utils');

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

const auth = require('./auth');
apiRouter.post('/auth/register', auth.register);
apiRouter.post('/auth/login', auth.login);
apiRouter.delete('/auth/logout', auth.logout);
apiRouter.get('/auth/me', auth.me);

const posts = require('./posts');
apiRouter.post('/posts/create', posts.create);
apiRouter.get('/posts/get', posts.get);
apiRouter.get('/posts/all', posts.all);

const comments = require('./comments');
apiRouter.post('/comments/create', comments.create);
apiRouter.get('/comments/get', comments.get);


const { IPGEOLOCATION_API_KEY } = require('./secrets');
const ipinfoCache = new Map();
apiRouter.get('/ipinfo', async (req, res) => {
  const ip = req.query.ip;
  if (typeof ip !== 'string') {
    throw new HttpError(500, 'Failed to fetch IP info');
  }

  if (ipinfoCache.has(ip)) {
    return res.json(ipinfoCache.get(ip));
  }

  const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEOLOCATION_API_KEY}&ip=${ip}`);
  if (!response.ok) {
    console.error(response.statusText, await response.json());
    throw new HttpError(500, 'Failed to fetch IP info');
  }
  const data = await response.json();
  ipinfoCache.set(ip, data);
  res.json(data);
});


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

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

require('./websocket');