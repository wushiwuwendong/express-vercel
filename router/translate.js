const EXPRESS=require('express')
const router=EXPRESS.Router()
var fs = require('fs');//引用文件系统模块
var Queue = require('promise-queue')
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const xml2js = require('xml2js');
let sid = 1585155488539406544;
let reqid = 500000;
var maxConcurrent = 4;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent,maxQueue);
router.get("/translate",async function(req,res){
    try{
        const message = req.query.message;
        const type = req.query.type;
        const response={
            result:await fanyi3(message)
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        res.json(response);
    } catch (error) {
        // 错误处理逻辑
        res.status(500).json({ error: error.message });
    }
    })
async function fanyi3(s) {
    reqid += 10;
    const url = `https://translate.google.com.hk/_/TranslateWebserverUi/data/batchexecute?rpcids=MkEWBc&source-path=/&f.sid=${sid}&bl=boq_translate-webserver_20230201.07_p0&hl=zh-CN&soc-app=1&soc-platform=1&soc-device=1&_reqid=${reqid}&rt=c`;
    //console.log(url);
    
    const payload = `f.req=${encodeURIComponent('[[["MkEWBc","[["' + s + '", "auto", "zh-CN", true],[null]]",null,"generic"]]]')}&`;
    //console.log(payload);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://translate.google.com/',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': 'NID=511=QoF6fEi9A7Z4U8ZAR8c97ixOH7PxCXphliWbfmbA-J5Cl9nM3VzN5X5JO0G_iZ_83GeFiGzz2s9UDY59WjeOiPnYPbHqSyj7QYAqAYoebHwsQMLM0WCUyTKofOiIKG7xS0q3mxAYMHRohL8PHNdf1Zuz_Xzm2XFDN64seRL47o0'
    };
  
    try {
      const response = await axios.post(url, payload, { headers });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
module.exports=router