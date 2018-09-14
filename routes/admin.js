const express = require('express');

const router = express.Router();

const login = require('./admin/login.js');
router.use('/login', login)

module.exports = router