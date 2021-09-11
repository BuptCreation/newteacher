var express = require("express");
var router=express.Router();
var model = require("../modules/model")
var ws=require("ws")
var router = express.Router();
var ws1=require("nodejs-websocket")





// function websocket_add_listener(client_sock){
//     client_sock.on("close",function () {
//         console.log("client close");
//     })
//
//     client_sock.on("error", function(err) {
//         console.log("client error", err);
//     });
//
//     client_sock.on("message", function(data) {
//         console.log(data);
//         client_sock.send("Thank you!");
//     });
//
// }
//
// function on_server_client_comming (client_sock) {
//     console.log("client comming");
//     websocket_add_listener(client_sock);
// }
//
// server.on("connection", on_server_client_comming);
//
// // error事件,表示的我们监听错误;
// function on_server_listen_error(err) {
//
// }
// server.on("error", on_server_listen_error);
//
// // headers事件, 回给客户端的字符。
// function on_server_headers(data) {
//     // console.log(data);
// }
// server.on("headers", on_server_headers);



router.get("/allowstudenttoshow",function (req,res,next) {          //对学生的查看文章的权限进行相应的限制
    var type=req.query.type;
    console.log("type的类型是",typeof type);
    // var data= {
    //     textno:req.query.datatextno,
    //     description:req.query.datadescription,
    //     content:req.query.datacontent,
    //     contentofone:req.query.datacontentofone,
    //     contentoftwo:req.query.datacontentoftwo,
    //     contentofthree:req.query.datacontentofthree
    // };
    var data=JSON.parse(req.query.data);
    console.log("data",data);
    console.log("data的textno",data.textno);
    console.log("data的groupno",data.groupno)
    model.connect(function (db,client) {
        if(type[1]==='n'){
            if(type[0]==='1'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,textno:data.textno},{$set:{statement1:0}})
            }else if(type[0]==='2'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,textno:data.textno},{$set:{statement2:0}})
            }else if(type[0]==='3'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,texetno:data.textno},{$set:{statement3:0}})
            }else if(type[0]==='4'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,textno:data.textno},{$set:{statement4:0}});
            }
        }else{
            if(type[0]==='1'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,textno:data.textno},{$set:{statement1:1}})
            }else if(type[0]==='2'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,textno:data.textno},{$set:{statement2:1}})
            }else if(type[0]==='3'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,texetno:data.textno},{$set:{statement3:1}})
            }else if(type[0]==='4'){
                db.collection("graphstatement").updateOne({groupid:data.groupno,textno:data.textno},{$set:{statement4:1}});
            }
        }
    })
    console.log("data的结果是：",data);
    res.render("checkarticle",{data:data});
})



// import model from "../modules/model"
// import express from "express";
/*行为：
表名：dataarrays:
          textno:
          authors:[]
          talks:[]  //.记录交流的次数
          logintimes:[] //.记录登录的次数
社交：
表名：social:
          textno:
          authors:[]
          totaltimes:[]  //.记录这个作者一共交流过多少
          connections:[]  //.记录一共有多少条交流线
          connecttimes:[] //.记录交流线交流过几次
          */


router.post("/submitdata",function (req,res,next) {             //教师添加写作和学生的相关信息的函数
    // var teacherno=document.getElementById("teacherno").value
    console.log(req.body)
    var data={
        textno:req.body.textno,
        teacherno:req.body.teacherno,
        groupno:req.body.groupno,
        description:req.body.description,
        texttitle:req.body.texttitle
    }
    var successflag=0;                      //用于检验数据是否插入成功
    var authors=[];                         //用于记录小组中的成员
    var contributions=[];                   //记录修改次数的数组
    var logintimes=[];                      //记录登陆次数的数组
    var talks=[];                           //记录谈话次数的数组
    model.connect(function (db) {   //模型连接数据库

        /*这部分代码主要是为了把小组的信息保存进dataarrays完成dataarrays的初始化*/
      db.collection("article").find({textno:data.textno}).toArray(function(err,ret) {
          if(err){
              console.log("查找文章号出现了一些系统故障!")
          }else{
              console.log("你好你好你好年红红",ret)
              if(ret.length!=0){
                  res.redirect("/teacherpage?teacherno="+data.teacherno);
              }
              else{
                  db.collection("buptgroup").find({groupid: parseInt(data.groupno)}).toArray(function (err, ret) {
                      if (err) {
                          console.log("查找小组成员出错了", err)
                          console.log("查找小组成员出错了", err)
                      } else {
                          console.log(ret)
                          console.log("这是groupno:", data.groupno)
                          ret.map(function (item, index) {
                              authors.push(item.studentno)
                              contributions.push(0)
                              logintimes.push(0)
                              talks.push(0)
                              console.log(authors)
                          })

                          //插入文章的函数
                          db.collection("dataarrays").insertOne({
                              textno: data.textno,
                              authors: authors,
                              contributions: contributions,
                              talks: talks,
                              logintimes: logintimes
                          }, function (err) {
                              if (err) {
                                  console.log("文章插入失败!", err)
                              } else {
                                  console.log("文章插入成功!")

                                  /*保存mapping的函数*/
                                  db.collection("mapping").insertOne({
                                      textno: data.textno,
                                      groupno: data.groupno,
                                      teacherno: data.teacherno
                                  }, function (err, ret) {
                                      if (err) {
                                          console.log("插入失败！", err)
                                      } else {
                                          console.log("插入成功！")
                                          successflag = 1;


                                          /*保存文章的函数*/
                                          db.collection("article").insertOne({
                                              textno: data.textno,
                                              description: data.description,
                                              title:data.texttitle,
                                              content: " ",
                                              teacherno: data.teacherno,
                                              groupno: data.groupno
                                          }, function (err, ret) {
                                              if (err) {
                                                  console.log("文章插入失败！", err)
                                              } else {
                                                  console.log("文章插入成功！")
                                                  if (1) {
                                                      res.redirect("/createarticle/createarticle?title=" + data.textno + "&teacherno=" + data.teacherno);
                                                  }
                                                  db.collection("graphstatement").insertOne({groupid:data.groupno,textno:data.textno,statement1:0,statement2:0,statement3:0,statement4:0},function (err,ret) {
                                                      if(err){
                                                          console.log("插入到graphstatement的时候出错了!");
                                                      }else{
                                                          db.collection("reflection").insertOne({textno:data.textno,content:" "});
                                                      }
                                                  });

                                              }
                                          })
                                      }
                                  })

                              }
                          })
                          db.collection("articlethreepartern").insertOne({
                              textno: data.textno,
                              description: data.description,
                              content: " ",
                              partern: "1"
                          }, function (err, ret) {
                              if (err) {
                                  console.log("出粗了")
                              } else {
                                  console.log("一稿插入成功")
                              }
                          })
                          db.collection("articlethreepartern").insertOne({
                              textno: data.textno,
                              description: data.description,
                              content: " ",
                              partern: "2"
                          }, function (err, ret) {
                              if (err) {
                                  console.log("出cuo了")
                              } else {
                                  console.log("二稿插入成功")
                              }
                          })
                          db.collection("articlethreepartern").insertOne({
                              textno: data.textno,
                              description: data.description,
                              content: " ",
                              partern: "3"
                          }, function (err, ret) {
                              if (err) {
                                  console.log("出粗了")
                              } else {
                                  console.log("三稿插入成功")
                              }
                          })

                    }
          })
              }
          }
      })

    })
    /*跳转到相应的页面*/

})


module.exports=router;
// export default router;






































































































































