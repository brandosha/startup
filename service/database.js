const { MONGODB_CONNECTION_URI } = require('./secrets');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_CONNECTION_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db('neighborhood');
const collections = {
  users: db.collection('users'),
  sessions: db.collection('sessions'),
  posts: db.collection('posts'),
  comments: db.collection('comments'),
};

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${MONGODB_CONNECTION_URI} because ${ex.message}`);
    process.exit(1);
  }
})();

module.exports = {
  users: {
    get(username) {
      return collections.users.findOne({ _id: username });
    },
    insert(user) {
      return collections.users.insertOne({
        _id: user.username,
        ...user
      });
    }
  },
  sessions: {
    get(token) {
      return collections.sessions.findOne({ token: token });
    },
    insert(session) {
      return collections.sessions.insertOne(session);
    },
    delete(token) {
      return collections.sessions.deleteOne({ token: token });
    }
  },
  posts: {
    get(postId) {
      return collections.posts.findOne({ _id: postId });
    },
    insert(post) {
      return collections.posts.insertOne({
        _id: post.id,
        ...post
      });
    },
    all() {
      return collections.posts.find().toArray();
    },
    async deleteExpired() {
      const cursor = collections.posts.find({ expirationDate: { $lte: new Date() } });
      for await (const post of cursor) {
        await collections.posts.deleteOne({ _id: post._id });
        await collections.comments.deleteMany({ postId: post._id });
      }
    }
  },
  comments: {
    get(postId) {
      return collections.comments.find({ postId }).toArray();
    },
    insert(comment) {
      return collections.comments.insertOne(comment);
    }
  }
};