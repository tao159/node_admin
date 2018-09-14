const express = require('express');

const router = express.Router();

//引入body-parser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//引入md5
const md5 = require('md5-node')

//引入db
var DB = require('../../modules/db.js');

router.get('/', function(req, res) {
    res.render('admin/login')
})

router.post('/doLogin', function(req, res) {
    //1.获取数据
    //req.body
    //加密密码
    var username = req.body.username;
    var password = md5(req.body.password);
    DB.find('user', {
        'username': username,
        'password': password
    }, function(error, data) {
        if (data.length > 0) {
            console.log('登录成功');
            //保存用户信息
            req.session.userinfo = data[0];

            //跳转到商品列表
            res.redirect('/admin/product');
        } else {
            res.send("<script>alert('登录失败');location.href='/admin/login';</script>")
        }
    })
})


module.exports = router