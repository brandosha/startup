const express = require('express');

const app = express();
app.use(express.static('public'));

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Service listening on port ${port}`);
});