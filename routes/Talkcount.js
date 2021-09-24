//引入express
var express = require('express');
var router = express.Router();
var model=require("../modules/model")
/* 获取静态页面 */
router.get('/', function(req, res, next) {
    model.connect(function (db,client) {
        var data=[];
        db.collection("mapping").find().toArray(function (err,ret) {
            if(err){
                console.log("除了一些小错误呢！")
            }else{
                var mapping=[];
                db.collection("article").find().toArray(function (err,ret) {
                        if(err){
                            console.log("jjjjj!");
                        }else{
                            console.log("mmllggbbddee",ret)
                            for(var i=0;i<ret.length;i++){
                                var a=ret[i].title;
                                var b=ret[i].textno;
                                mapping.push({textno:b,title:a});
                            }
                            console.log("mappingdeshuzhihsi",mapping)
                            for(var i=0;i<ret.length;i++){
                                var textno=ret[i].textno;
                                var groupno=ret[i].groupno;
                                var title;
                                for(var j=0;j<mapping.length;j++){
                                    if(mapping[j].textno==textno){
                                        title=mapping[j].title;
                                        break;
                                    }
                                }
                                data.push({textno:textno,groupno:groupno,title:title});
                            }
                            console.log("mlgbde",data)
                            res.render("Talkcount",{data:data});
                        }
                    }
                )

            }
        })
    })


});
//导出抹开
module.exports = router;