let http=require('http')
let WebSocket = require('ws');
var ShareDB = require("sharedb")
let WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var titles="test-doc"
var teacherRouter = require('../routes/teacher')
var createRouter = require('../routes/article')
var bodyParser = require('body-parser');
var indexRouter = require('../routes/index')
var lookRouter = require('../routes/lookarticle')
var eChartsRouter = require("../routes/echarts")
// import studentRouter from "../routes/student"
// import teacherRouter from '../routes/teacher';
// import createRouter from '../routes/article'
// import bodyParser from 'body-parser'
// import writeRouter from "../routes/write"
// import displayRouter from '../routes/display'
// import session from 'express-session';
// import logger from 'morgan'
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import createError from 'http-errors';
// import express from 'express'
// import WebSocketJSONStream from '@teamwork/websocket-json-stream';
// import ShareDB from "sharedb";
// import WebSocket from 'ws';

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');          //指定view的模板和路径

app.use(express.static('static'));
app.use(express.static('node_modules/quill/dist'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use('/',indexRouter);           //各个路由模块
app.use('/teacher',teacherRouter);
app.use('/createarticle',createRouter);
app.use('/lookarticle',lookRouter);
app.use('/echarts',eChartsRouter)
// error handler

app.set('port',8082);
let server = http.createServer(app);
// Connect any incoming WebSocket connection to ShareDB


server.listen(8082);       //设置wss监听端口号8082
console.log('the main chengxu Listening on http://localhost:8082');

//直接开始创建服务器，和sharedb






// Create initial document then fire callback


