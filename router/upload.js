const EXPRESS=require('express')
const router=EXPRESS.Router()
const multer = require('multer')

var fs = require('fs');//引用文件系统模块
const upload = multer({ storage: storage })
const storage = multer.diskStorage({
    //保存路径
    destination: function (req, file, cb) {
      cb(null, '/var/task/upload')
      //注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
    },
    //保存在 destination 中的文件名
    filename: function (req, file, cb) {    
      cb(null, file.originalname)
    }
  })
router.post("/upload",upload.single("image"),(req,res)=>{
    console.log(req.file)
    //console.log(typeof(req.file))
    res.json({status: "200", message: '收到图片1'})
})

module.exports=router