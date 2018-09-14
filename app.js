const port = 9001
const express = require('express')
const app = express()

//引入express-session
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

//设置模板引擎
app.set('view engine', 'ejs')

//设置模板引擎
app.use(express.static('static'))


const index = require('./routes/index.js')
const admin = require('./routes/admin.js')



app.use('/', index)
app.use('/admin', admin)


app.listen(port, '127.0.0.1', function() {
    console.log('server running at 127.0.0.1:' + port)
})