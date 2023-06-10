const EXPRESS=require('express')
const router=EXPRESS.Router()

app.get("/download",async function(req,res){
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