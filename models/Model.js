const MongoClient = require('mongodb').MongoClient,
  assert = require('assert')

const databaseConfig = require('../configs/database')

// Connect
var connectDatabase = callback => {
  MongoClient.connect(databaseConfig.url, (err, db) => {
    assert.equal(null, err);
    callback(db);
  })
}

// Insert many
var insertDocuments = (db, collection, arr, callback) => {
  // Get the documents collection
  var collection = db.collection(collection);
  // Insert some documents
  collection.insertMany(arr, (err, result) => {
    assert.equal(err, null);
    callback(result);
    db.close();
  })
}

// Find documents with query
var findDocuments = (db, collection,  query, callback) => {
  // Get the documents collection
  var collection = db.collection(collection);
  //Get some documents
  collection.find(query).toArray((err, docs) => {
    assert.equal(err, null);
    callback(docs);
    db.close();
  })
}

// Update documents
var updateDocument = (db, collection, target, set, callback) => {
  // Get collection
  var collection = db.collection(collection);
  collection.updateOne(target, set, (err, result) => {
    assert.equal(null, err);
    callback(result);
  })
}

// Remove one
var removeDocument = (db, collection, query, callback) => {
  // Get collection
  var collection = db.collection(collection);
  // Remove one with query
  collection.deleteOne(query, (err, result) => {
    callback(result);
  });
}

class Model {
  constructor (collection) {
    this.collection = collection;
  }

  find (query, callback) {
    connectDatabase(database => {
      findDocuments(database, this.collection, query, callback)
    })
  }

  insert (arr, callback) {
    connectDatabase(database => {
      insertDocuments(database, this.collection, arr, callback)
    })
  }

  update (target, set, callback) {
    connectDatabase(database => {
      updateDocument(database, this.colleciton, target, set, callback)
    })
  }

  remove (target, callback) {
    connectDatabase(database => {
      removeDocument(database, this.collectin, target, callback)
    })
  }

}

module.exports = Model;
