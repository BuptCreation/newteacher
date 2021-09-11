var express = require("express")
var router = express.Router()
var model=require('../modules/model')
// import express from "express";

router.get('/',function (req,res,next) {
    res.render('index',{})
})

router.get('/test',function (req,res,next) {
    res.render('show',{})
})

router.get('/teacherpage',function (req,res,next) {
    var data={
        teacher:"已发布的全体文章列表:",
        list:[]
    };
    let arrays=[];
    model.connect(function (db) {
        db.collection("article").find().toArray(function (err,ret) {
            if(err){
                console.log("读取文章出错了!")
            }else{
                console.log("读取文章成功!")
                data.list=ret;
                db.collection("buptgroup").find().toArray(function (err,ret) {
                    if(err){
                        console.log("出错了!")
                    }else{

                        let flags=0;
                        console.log(ret)
                        for(var i=0;i<ret.length;i++){
                            for(var i1=0;i1<arrays.length;i1++){
                                if(arrays[i1]===""+ret[i].groupid){
                                    flags=1;
                                    break;
                                }
                            }
                            if(flags===0){
                                arrays.push(""+ret[i].groupid);
                            }
                            flags=0;
                        }
                        console.log(arrays);

                        res.render('teacher',{data:data,arrays:arrays})
                    }
                }
                )

            }
        })
    })

})




module.exports=router
// export default router;
