const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://Shirmal:<300300AzIT>@clusters-zklgt.mongodb.net/admin?retryWrites=true&w=majority')
        .then(client => {
            console.log('connected to mongoDB');
            callback(client);
        }).catch(err => {
            console.log(err);

        })
};

module.exports = mongoConnect;