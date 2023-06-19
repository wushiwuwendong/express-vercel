const EXPRESS=require('express')
const router=EXPRESS.Router()
var fs = require('fs');//引用文件系统模块
var Queue = require('promise-queue')
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
var maxConcurrent = 4;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent,maxQueue);
const token = 'ULRGZ30uR9r7F9r99ZZbL8rsf73j2g20';
router.use(bodyParser.text({ type: 'text/xml' }));
router.get("/wx",async function(req,res){
    //console.log(req.query['filename'])
    queue.add(function () {
   
        const echoStr = req.query.echostr;
        if (checkSignature(req.query)) {
          res.send(echoStr);
        } else {
          res.send('');
        }

    })
   
    
    
})

router.post('/wx', (req, res) => {
    const xmlData = req.body;
    const fromUsername = xmlData.FromUserName;
    const toUsername = xmlData.ToUserName;
    const keyword = xmlData.Content;
    console.log(xmlData);
    const url = 'https://www.mcxiaodong.top/chatapi/sendmessage';
    const wxid = 'wuwendongweb';
    const message = xmlData;
    console.log(xmlData);
    axios.get(url, {
    params: {
        wxid: wxid,
        message: message
    }
    })
    .then(response => {
        console.log(response.data);  // 在这里处理响应数据
    })
    .catch(error => {
        console.error(error);  // 在这里处理错误
    });

    const responseXml = generateResponseXml(fromUsername, toUsername, keyword);
    res.set('Content-Type', 'text/xml');
    res.send(responseXml);
  });
  
function checkSignature(query) {
    const signature = query.signature;
    const timestamp = query.timestamp;
    const nonce = query.nonce;
  
    const tmpArr = [token, timestamp, nonce];
    tmpArr.sort();
    const tmpStr = tmpArr.join('');
    const sha1Str = crypto.createHash('sha1').update(tmpStr).digest('hex');
  
    return sha1Str === signature;
  }
  
  function generateResponseXml(fromUsername, toUsername, keyword) {
    let responseContent;
    let responseMsgType;
    console.log("关键词"+keyword)
    if (keyword === '验证码') {
      responseContent = `您的验证码为: ${generateCode()}`;
      responseMsgType = 'text';
    } else if (keyword) {
      responseContent = '您发送的是文本消息!';
      responseMsgType = 'text';
    } else {
      responseContent = 'Input something...';
      responseMsgType = 'text';
    }
  
    const createTime = Math.floor(Date.now() / 1000);
    const responseXml = `
      <xml>
        <ToUserName><![CDATA[${fromUsername}]]></ToUserName>
        <FromUserName><![CDATA[${toUsername}]]></FromUserName>
        <CreateTime>${createTime}</CreateTime>
        <MsgType><![CDATA[${responseMsgType}]]></MsgType>
        <Content><![CDATA[${responseContent}]]></Content>
        <FuncFlag>0</FuncFlag>
      </xml>
    `;
  
    return responseXml;
  }
  
  function generateCode() {
    const chars = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];
    const shuffled = chars.sort(() => 0.5 - Math.random());
    const code = shuffled.slice(0, 6).join('');
    return code;
  }
module.exports=router