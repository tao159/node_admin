const express = require('express')

const app = express()

const port = 8090

var fs = require('fs');
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
    DB.find('product', {
        '_id': new DB.ObjectID(id)
    }, function(error, data) {
        res.render('productedit', {
            list: data[0]
        });
    })
})



//获取登录提交的数据
app.post('/doLogin', function(req, res) {

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

//执行修改路由
app.post('/doProductEdit', function(req, res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload'; //上传图片保存的地址  目录必须存在
    form.parse(req, function(err, fields, files) {
        //fields获取表单的数据
        //files图片上传成功返回的信息
        // console.log(fields);
        var _id = fields._id[0],
            title = fields.title[0],
            price = fields.price[0],
            fee = fields.fee[0],
            description = fields.description[0],
            origunalFilename = files.pic[0].originalFilename,
            pic = files.pic[0].path;

        if (origunalFilename) {
            var setData = {
                title,
                price,
                fee,
                description,
                pic
            }
        } else {
            var setData = {
                title,
                price,
                fee,
                description
            };
            fs.unlink(pic);
        }

        DB.update('product', {
            "_id": new DB.ObjectID(_id)
        }, setData, function(err, data) {

            if (!err) {
                res.redirect('/product');
            }

        })
    })
})

//删除商品
app.get('/productdelete', function(req, res) {
    var _id = req.query.id;
    DB.deleteOne('product', {
        "_id": new DB.ObjectID(_id)
    }, function(err, data) {
        if (!err) {
            res.redirect('/product');
        }
    })
})

app.listen(port, '127.0.0.1', function() {
    console.log('the server running at 127.0.0.1:' + port);
})