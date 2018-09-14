const express = require('express')

const router = express.Router()

router.get('/', function(req, res) {
    res.send('product-index')
})

router.get('/productedit', function(req, res) {
    res.send('product-edit')
})

router.get('/productadd', function(req, res) {
    res.send('product-add')
})

module.exports = router