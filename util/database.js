const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://Shirmal:300300AzIT@clusters-zklgt.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then(client => {
      console.log("connected to mongoDB");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No database found";
  }
};

exports.mongoConnect = mongoConnect;

exports.getDb = getDb;
