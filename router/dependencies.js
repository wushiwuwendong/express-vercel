const EXPRESS=require('express')
const router=EXPRESS.Router()
router.get('/dependencies/list', (req, res) => {
    const { exec } = require('child_process');
    
    exec('npm ls --json', (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message, stdout:stdout.message, sterr:stderr.message });
            return;
          }
      
      const dependencies = JSON.parse(stdout);
      res.json(dependencies);
    });
  });
  router.get('/dependencies/dir', (req, res) => {
    res.json({dir:__dirname});
  });
module.exports=router