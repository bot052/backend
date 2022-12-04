// @ts-check
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://j:2134@cluster0.fervjll.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;
