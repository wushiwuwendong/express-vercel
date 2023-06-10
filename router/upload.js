const EXPRESS=require('express')
const router=EXPRESS.Router()
const multer = require('multer')
var baidutoken = require("./datastore").baidutoken;
var fs = require('fs');//引用文件系统模块
const { createClient } = require("webdav");
const client = createClient(
    "https://pan.mcxiaodong.top/dav",
    {
      username: "admin",
      password: "asd5201314",
    }
);

const storage = multer.diskStorage({
    //保存路径
   /* destination: function (req, file, cb) {
      cb(null, '/var/task/upload')
      //注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
    },
    //保存在 destination 中的文件名
    filename: function (req, file, cb) {    
      cb(null, file.originalname)
    }*/
  })
const upload = multer({ storage: storage })
router.post("/upload",upload.single("image"),async (req,res)=>{
    // 获取保存的图片信息
    try{
      const { originalname,filename, size, path } = req.file;
      await hqtp();
      var files = fs.readFileSync(path);
      var imggg=new Buffer(files).toString('base64');
      console.log(await sbtable(imggg));
      // 构造响应数据
      const response = {
        status: 200,
        message: "收到图片",
        filename: originalname,
        size: size,
        path: path,
        uplaodstatus:await client.putFileContents("/ghost/hxj/upload/"+originalname, fs.readFileSync(path),true),
        baidutoken:baidutoken

      };
      res.json(response);
      // 将响应数据以 JSON 格式返回
    } catch (error) {
    // 错误处理逻辑
    res.status(500).json({ error: error.message });
  }
  
 
})
function hqtp() {
  return new Promise((resolve, reject) => {
    var request = require('request');
    request.get(
      {
        url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=QoWAr0N0jj45Y8lbpUBBHGxA&client_secret=1V9EZFbbLTtUWTofcsK6Qlmr4GhD6HOP&',
        encoding: 'utf8'
      },
      function (error, response, body) {
        if (response.statusCode == 200) {
          console.log("获取百度token" + JSON.parse(body)['access_token']);
          baidutoken=JSON.parse(body)['access_token'];
          resolve(JSON.parse(body)['access_token']);
        } else {
          reject(new Error("获取百度token失败"));
        }
      }
    );
  });
}
function sbtable(url,s) {
  var request = require('request');
  let options = {
      url: url,
      form:{image:s},
  };

  return new Promise(function (resolve, reject) {
      request.post(options, function (error, response, body) {
          if (error) {
              reject(error);
          } else {
              resolve(body);
          }
      });
  });
}
module.exports=router