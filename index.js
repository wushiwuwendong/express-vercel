const EXPRESS=require('express')
const app=EXPRESS()
const fs = require('fs');//引用文件系统模块
var expressWs = require('express-ws');
expressWs(app);
const listStoryR=require("./router/listStory")
const listAnnR=require("./router/announcementList")
const forumList=require("./router/forumList")
const novelView=require("./router/novelView")
const novelDetail=require("./router/novelDetail")
const userInfo=require("./router/userInfo")
const image=require("./router/image")
const Login=require("./router/login")
const Download=require("./router/download")
const Depend=require("./router/dependencies")
const Upload=require("./router/upload");
const WxServer=require("./router/wxServer");
const Translate=require("./router/translate");

var userinfo=require("./router/datastore").userinfo

const Pusher = require("pusher");
const token = 'ULRGZ30uR9r7F9r99ZZbL8rsf73j2g20';
const pusher = new Pusher({
  appId: "1616885",
  key: "82c3a115672d9387be63",
  secret: "797daf2c93986300b947",
  cluster: "ap1",
  useTLS: true
});

/*pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});*/


console.log(__dirname);
//中间件配置
//适应Post请求
app.use(EXPRESS.json())
//适应get请求
app.use(EXPRESS.urlencoded({extended:false}))

//静态文件托管
// app.use('/static',EXPRESS.static("static"))
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

//路由中间件
app.use("/",listStoryR)
app.use("/",listAnnR)
app.use("/",forumList)
app.use("/",novelView)
app.use("/",userInfo)
app.use("/",novelDetail)
app.use("/",image)
app.use("/",Login)
app.use("/",Download)
app.use("/",Depend)
app.use("/",Upload)
app.use("/",WxServer)
app.use("/",Translate)
// 全局错误处理中间件
app.use((err, req, res, next) => {
    // 设置错误状态码，默认为 500 内部服务器错误
    const statusCode = err.statusCode || 500;
    const path = require('path');
    
    const uploadFolderPath = path.join(process.cwd(), 'upload');
    // 构造错误响应对象
    const errorResponse = {
      status: statusCode,
      message: err.message,
      stack: err.stack, // 堆栈跟踪信息（仅用于开发环境，生产环境应该禁用）
      path: uploadFolderPath 
    };
  
    // 将错误信息以 JSON 格式返回
    res.status(statusCode).json(errorResponse);
  });
app.get("/",(req, res)=>{
    res.send(`<div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">
                    <h1>欢迎使用华熙佳发货apii</h1>
                    <div>post-llist</div>
                    <ul style="list-style: none;padding-left: 0;">
                        <li><a href="https://express-vercel-ruby.vercel.app/download">/download</a></li>
                        <li><a href="https://express-vercel-ruby.vercel.app/forumList">/forumList</a></li>
                        <li><a href="https://express-vercel-ruby.vercel.app/listStory">/listStory</a></li>
                        <li><a href="https://express-vercel-ruby.vercel.app//novelView">/novelView</a></li>
                    </ul>
                    </div>
    `)
})
app.get("/info",(req, res)=>{
    res.json({host:server.address().address,post:server.address().port})
})
app.get("/list",(req, res)=>{
    res.json({result:userinfo})
})
app.post("/pusher/user-auth", (req, res) => {
    const socketId = req.body.socket_id;
    const ipAddress = req.ip;
  
    // Replace this with code to retrieve the actual user id and info
    const user = {
      id: socketId,
      user_info: {
        name: "personal"+userinfo.length,
        ip: ipAddress,
      },
      watchlist: ['another_id_1', 'another_id_2']
    };
    userinfo.push(user);
    const authResponse = pusher.authenticateUser(socketId, user);
    res.send(authResponse);
  });
  
var server=app.listen('3001',function(){
    var host = server.address().address;
    var port = server.address().port;
    //hqtp()
    console.log('服务器开启在 http://%s:%s', host, port);
})