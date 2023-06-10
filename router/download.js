const EXPRESS=require('express')
const router=EXPRESS.Router()
var fs = require('fs');//引用文件系统模块

app.get("/download",(req, res)=>{
    //console.log(req.query['filename'])

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
module.exports=router