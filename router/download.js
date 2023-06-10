const EXPRESS=require('express')
const router=EXPRESS.Router()
var fs = require('fs');//引用文件系统模块
var Queue = require('promise-queue')
var maxConcurrent = 4;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent,maxQueue);
router.get("/download",async function(req,res){
    //console.log(req.query['filename'])
    queue.add(function () {
      fs.exists("../done/"+req.query['filename'],function(exists){
        if(exists){
            res.download("../done/"+req.query['filename'])
            return
        }else{
            res.json({status: "404", message: '文件不存在'})
            return
        }
    })
    })
   
    
    
})
module.exports=router