const EXPRESS=require('express')
const router=EXPRESS.Router()
const multer = require('multer')
const upload = multer({ storage: storage })
var fs = require('fs');//引用文件系统模块

router.post("/upload",(req,res)=>{
    console.log(req.file)
    //console.log(typeof(req.file))
    res.json({status: "200", message: '收到图片'})
})

module.exports=router