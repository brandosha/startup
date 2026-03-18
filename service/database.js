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

const db = client.db('simon');
const collections = {
  users: db.collection('users'),
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


function insertUser(user) {
  return collections.users.insertOne(user);
}

module.exports = {
  insertUser,
};