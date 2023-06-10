const EXPRESS=require('express')
const router=EXPRESS.Router()
router.get('/dependencies', (req, res) => {
    const { exec } = require('child_process');
    
    exec('npm ls --json', (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message, stdout:stdout, sterr:stderr });
            return;
          }
      
      const dependencies = JSON.parse(stdout);
      res.json(dependencies);
    });
  });
module.exports=router