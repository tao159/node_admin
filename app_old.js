var express = require('express');
var app = express();
var index = require('./routes/index.js');
var admin = require('./routes/admin.js');

app.use('/', index);
app.use('/admin', admin);

app.listen(3003, '127.0.0.1', function() {
    console.log('the server running at 127.0.0.1:3003');
});