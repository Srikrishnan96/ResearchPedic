const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://Chennai:Andymama1@cluster0-kvh0o.mongodb.net/Research-pedic?retryWrites=true&w=majority').then(client => {
        _db = client.db();
        cb();
    }).catch( err => {
        console.log(err);
    })
}

const getDb = function() {
    if(_db) {
        return _db;
    }
    throw 'There is no database';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

