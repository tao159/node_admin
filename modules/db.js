//2.数据库操作
var MongoClient = require('mongodb').MongoClient;

//数据库地址
var dbUrl = "mongodb://localhost:27017/productmanage";

var ObjectID = require('mongodb').ObjectID;

//高版本mongodb连接数据库使用
var db;

//连接数据库
function __connectDb(callback) {
    MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            console.log('数据库连接失败');
            return;
        }
        db = client.db('productmanage');
        //增加 修改 显示 删除
        callback(client);
    })
}

//查询数据
exports.find = function(collectionname, json, callback) {
    __connectDb(function(client) {
        var database = db.collection(collectionname).find(json);
        database.toArray(function(error, data) {
            client.close();
            callback(error, data);
        })
    })
}

//添加数据
exports.insert = function(collectionname, json, callback) {
    __connectDb(function(client) {
        db.collection(collectionname).insertOne(json, function(error, data) {
            callback(error, data)
        })
    })
}

//修改数据
exports.update = function(collectionname, json1, json2, callback) {
    __connectDb(function(client) {
        db.collection(collectionname).updateOne(json1, { $set: json2 }, function(error, data) {
            callback(error, data)
        })
    })
}



//删除数据
exports.deleteOne = function(collectionname, json, callback) {
    __connectDb(function(client) {
        db.collection(collectionname).deleteOne(json, function(error, data) {
            callback(error, data)
        })
    })
}

exports.ObjectID = ObjectID;