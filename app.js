var express = require('express');

var app = express();

//1.引入body-parser
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

//2.引入db.js
var DB = require('./modules/db.js');
//3.引入express-session
var session = require('express-session');

//配置express-session中间件
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    rolling: true
}))

//4.引入MD5
var md5 = require('md5-node')

//5.图片上传插件使用
var multiparty = require('multiparty'); //既可以获取form表单的数据，也可以实现图片上传


//设置模板引擎
app.set('view engine', 'ejs');

//设置静态资源目录
app.use(express.static('static'));

//设置虚拟目录，用于显示上传到upload文件夹的图片
app.use('/upload', express.static('upload'))

//自定义中间件，判断登录状态
app.use(function(req, res, next) {
    // if (req.url == '/login' || req.url == '/doLogin') {
    //     next();
    // } else {
    //     if (req.session.userinfo && req.session.userinfo.username != '') { //判断有没有登录

    //         //ejs中设置全局数据，所有页面都能使用
    //         app.locals['userinfo'] = req.session.userinfo;
    //         next();
    //     } else {
    //         res.redirect('/login')
    //     }
    // }
    next();
})

//设置路由
app.get('/', function(req, res) {
    res.send('index')
})

app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/productadd', function(req, res) {
    res.render('productadd');
})

//获取表单提交的数据以及post过来的图片
app.post('/doProductAdd', function(req, res) {
    //获取表单提交的数据以及post过来的图片
    var form = new multiparty.Form();
    form.uploadDir = 'upload'; //上传图片保存的地址  目录必须存在
    form.parse(req, function(err, fields, files) {
        //fields获取表单的数据
        //files图片上传成功返回的信息
        var goods = {
            title: fields.title[0],
            price: fields.price[0],
            fee: fields.fee[0],
            description: fields.description[0],
            pic: files.pic[0].path
        }
        DB.insert('product', goods, function(error, data) {
            if (error) {
                console.log(error);
                return false;
            }
            console.log(data);
            res.redirect('/product'); //写入数据库以后跳转到首页
        })
    })
})


app.get('/productedit', function(req, res) {
    var id = req.query.id;
    DB.find('product', { '_id': new DB.ObjectID(id) }, function(error, data) {
        res.render('productedit', {
            list: data[0]
        });
    })
})

app.get('/productdelete', function(req, res) {
    res.send('productdelete')
})

//获取登录提交的数据
app.post('/doLogin', function(req, res) {
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
            res.redirect('/product');
        } else {
            res.send("<script>alert('登录失败');location.href='/login';</script>")
        }
    })
})

app.get('/loginOut', function(req, res) {
    //销毁session
    req.session.destroy(function(err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/login')
        }
    })
})

app.get('/product', function(req, res) {
    DB.find('product', '', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            res.render('product', {
                list: data
            })
        }
    })
})

app.listen(3001, '127.0.0.1', function() {
    console.log('the server running at 127.0.0.1:3001');
});