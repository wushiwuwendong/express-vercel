const EXPRESS=require('express')
const router=EXPRESS.Router()


app.get("/download",(req, res)=>{
    //console.log(req.query['filename'])

     
            res.json({status: "404", message: '文件不存在'})
            
  

   
    
    
})
module.exports=router