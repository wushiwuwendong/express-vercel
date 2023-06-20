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
var Queue = require('promise-queue');
const PromiseQueue = require('promise-queue');

var maxConcurrent = 4;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent,maxQueue);

// 创建 PromiseQueue 实例
const queuee = new PromiseQueue();

// 存储异步执行结果的对象
const results = [];
// 将异步函数添加到执行队列，并分配一个 ID
function addToQueueAndAssignId(asyncFn) {
  const result = {};
  const id = Date.now().toString(); // 生成唯一的 ID
  result["id"] = id; // 将 Promise 存储到结果对象中
  results.push(result);
  queue.add(async function () {
    const currentId = id; // 将 id 保存到一个新的变量中
      try {
        console.log("id="+id)
        console.log("currentId="+currentId)
 
        const resultrespne = await asyncFn;
        
      console.log(resultrespne)
     
      const resultt = results.filter((item) => {
        return item.id == id
        })
      console.log("搜索结果"+resultt.length)
      resultt["result"]=resultrespne
        // 处理获得的结果
        console.log("最终结果"+result);
      } catch (error) {
        // 处理错误
        console.log(error);
      }
    
    
  }); // 将异步函数添加到队列
}

  function addToQueueSbtable(asyncFn) {
    const result = {};
    const id = Date.now().toString(); // 生成唯一的 ID
    result["id"] = id; // 将 Promise 存储到结果对象中
    results.push(result);
    queue.add(async function () {
      const currentId = id; // 将 id 保存到一个新的变量中
        try {
          console.log("id="+id)
          console.log("currentId="+currentId)
   
          sbtable(asyncFn, id)
    .then(result => {
      // 处理获得的结果
      console.log(result);
    })
    .catch(error => {
      // 处理错误
      console.log(error);
    });
        } catch (error) {
          // 处理错误
          console.log(error);
        }
      
      
    }); // 将异步函数添加到队列

  console.log(results)
  return id; // 返回分配的 ID
}
// 通过 ID 获取异步执行结果
function getResultById(id) {
  const resultt = array.filter(item => item.id === id);
  if (resultt.length>0) {
    return resultt;
  }
  return Promise.reject(new Error('Invalid Task ID'));
}
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
router.get("/queue/list",async function(req,res){
  console.log(results);
  const responses = {
    queue:results
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
    
  res.json(responses);
});
router.post("/upload",upload.single("image"),async (req,res)=>{
    // 获取保存的图片信息
    try{
      const { originalname,filename, size, path } = req.file;
      await hqtp();
      var files = fs.readFileSync(path);
      var imggg=new Buffer(files).toString('base64');
      var table=await sbtable(imggg);
     // var table=addToQueueSbtable(imggg);
      const xm = req.query.xm;
      const type = req.query.type;
      const id = req.query.id;
    
      // 构造响应数据
     /* queue.add(function () {
        await client.putFileContents("/ghost/hxj/upload/"+originalname, fs.readFileSync(path),true)
      })*/
      const response = {
          status: 200,
          message: "收到图片2",
          filename: originalname,
          size: size,
          path: path,
          uplaodstatus:addToQueueAndAssignId(client.putFileContents("/ghost/hxj/upload/"+originalname, fs.readFileSync(path),true)),
          baidutoken:baidutoken,
          table:table
          //table:JSON.parse(table)
  
        };
        res.setHeader('Access-Control-Allow-Origin', '*');
    
      res.json(response);
      // 将响应数据以 JSON 格式返回
    } catch (error) {
    // 错误处理逻辑
    res.status(500).json({ error: error.message });
  }
  
 
})

function isJSON(variable) {
  if (typeof variable === 'string') {
    try {
      JSON.parse(variable);
      return JSON.parse(variable); // 变量是JSON格式
    } catch (error) {
      return variable; // 变量是字符串
    }
  } else {
    return false; // 变量不是字符串
  }
}

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
function sbtable(s,id) {
  var request = require('request');
  let options = {
      url: "https://aip.baidubce.com/rest/2.0/ocr/v1/table?access_token="+baidutoken,
      form:{image:s},
  };
  //console.log(options);
  console.log("识别表格")
  return new Promise(function (resolve, reject) {
      request.post(options, function (error, response, body) {
          if (error) {
              reject(error);
          } else {
            const resultt = results.filter((item) => {
              return item.id == id
              })
            console.log("搜索结果"+resultt.length)
            resultt["result"]=resultrespne
              resolve(body);
          }
      });
  });
}
module.exports=router