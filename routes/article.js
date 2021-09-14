let richText = require('rich-text');
let ShareDB = require('sharedb');

const db=require("sharedb-mongo")("mongodb://47.94.108.20:27017/BuptCreation");
const backend = new ShareDB({db});        //创建sharedb数据库

ShareDB.types.register(richText.type);
var WebSocket = require('ws');
var express = require("express")
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var router = express.Router()
var http = require('http');
// import richText from "rich-text";
// import ShareDB from "sharedb";
// import express from "express";
// import http from 'http';
// import WebSocket from 'ws';
// import WebSocketJSONStream from '@teamwork/websocket-json-stream';

router.get('/',function (req,res,next) {

})

let wss=null

let app = express();
app.use(express.static('static'));
app.use(express.static('node_modules/quill/dist'));
let server = http.createServer(app);

// Connect any incoming WebSocket connection to ShareDB
wss = new WebSocket.Server({server: server});
wss.on('connection', function(ws) {
    let stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
});

server.listen(8085);
console.log('The sharedbserver Listening on http://localhost:8085');


router.get('/createarticle',function(req,res,next){
    let teacherno=req.query.teacherno;
    console.log("已经进入该方法了！");
    var articlename = req.query.title;
    var times=req.query.type;
    if(times="many"){
        var nums=articlename.split(' ');
        for(var t=0;t<nums.length;t++){
            console.log(nums[t]);
            createDoc(nums[t]);
            createreflectionDoc(""+nums[t]+"reflection")
        }
    }else if(times=="one"){
        createDoc(articlename);
        createreflectionDoc(""+articlename+"reflection")
    }

// Create initial document then fire callback
    console.log(articlename);
// Create initial document then fire callback
    function createDoc(article) {

        let connection = backend.connect();             //sharedb连接到端口
        var id=""+article;
        let doc = connection.get('examples', id);   //让doc获取sharedb数据库的example连接中的test-doc文档
        doc.fetch(function (err) {           //获取文档中的数据但是不会触发事件啥的
            if (err) throw err;

            if (doc.type === null) {          //如果当前文档是空的，也就是没有数值的话；会创建一个新的文
                    doc.create([], 'rich-text')
            }
        });
    }
    function createreflectionDoc(article) {

        let connection = backend.connect();             //sharedb连接到端口
        var id=""+article;
        let doc2=connection.get('reflectionse',id)
        doc2.fetch(function (err) {           //获取文档中的数据但是不会触发事件啥的
            if (err) throw err;

            if (doc2.type === null) {          //如果当前文档是空的，也就是没有数值的话；会创建一个新的文
                doc2.create([], 'rich-text')
            }
        });
    }
    res.redirect("/teacherpage?teacherno="+teacherno)

})


router.post("/test",function (req,res,next) {
    var connection = backend.connect();
    var doc = connection.get("examples","nihao1");
    console.log(doc.connection.Connection)
})

module.exports=router;
// export default router;