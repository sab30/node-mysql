const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/',function(req,res){
    res.sendFile('/Users/sabarishk/sabarish/mypulse.new/apidoc/index.html');
});

module.exports = router;