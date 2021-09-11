var Mongo=require("mongodb").MongoClient
var url="mongodb://47.94.108.20:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
var dbName="BuptCreation"
// var url="mongodb://localhost:27017"
// var dbName="finally"


function connect(callback) {
    Mongo.connect(url,function (err,client) {
        if(err){
            console.log("连接出现错误",err)
        }else{
            var db=client.db(dbName)
            console.log("连接成功到mongodb://47.94.108.20:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false\n")
            callback && callback(db,client)
        }
    })
}


module.exports= {
    connect
}
// export default connect;