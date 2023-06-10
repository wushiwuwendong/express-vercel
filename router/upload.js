const EXPRESS=require('express')
const router=EXPRESS.Router()
const multer = require('multer')

var fs = require('fs');//引用文件系统模块

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
const upload = multer({ storage: storage })
router.post("/upload",upload.single("image"),(req,res)=>{
    // 获取保存的图片信息
    try{
      const { filename, size, path } = req.file;

      // 构造响应数据
      const response = {
        status: 200,
        message: "收到图片",
        filename: filename,
        size: size,
        path: path
      };
      res.json(response);
      // 将响应数据以 JSON 格式返回
    } catch (error) {
    // 错误处理逻辑
    res.status(500).json({ error: error.message });
  }
  
 
})

module.exports=router