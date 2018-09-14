var express = require('express');
var router = express.Router();
var login = require('./admin/login.js');
var product = require('./admin/product.js')
router.get('/', function(req, res) {
    res.send('admin-index');
})

router.use('/login', login);

router.use('/product', product);
module.exports = router