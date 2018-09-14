var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.send('login-index');
})

router.post('/doLogin', function(req, res) {
    res.send('处理登录模块');
})

module.exports = router;