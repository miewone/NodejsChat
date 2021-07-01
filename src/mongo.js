const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri,{
    userNewUrlParser:true,
    useUnifiedTopology:true
})

module.exports = client