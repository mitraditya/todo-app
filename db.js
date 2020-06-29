const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const keys = require("./config/keys");
const dbname = "crud_todo";
const mongourl = keys.mongourl;
const mongoOptions = {useNewUrlParser : true, useUnifiedTopology: true };

const state = {
    db : null
};

const connect = (cb) =>{
    if(state.db) //to check if there's a database connection
    cb();
    else{ //if there isn't a database connection, use MongoClient to connect to the database
        MongoClient.connect(mongourl,mongoOptions,(err,client)=>{
            if(err)
            cb(err);
            else{
                state.db = client.db(dbname);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id)=>{
    return ObjectID(_id);
}

const getDB = ()=>{
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};