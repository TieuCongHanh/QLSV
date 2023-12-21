var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var product_api=require('../controllers/api/sanpham.api');
var user_api=require('../controllers/api/user.api');

// URL: GET: /api/product
router.get('/sp',product_api.list);
router.post('/sp/search',product_api.search);
router.post('/sp/:idsp',product_api.chitiet);




router.get('/user',user_api.list);
router.post('/user/login',user_api.login);
router.get('/user/login',user_api.login);
router.post('/user/dk',user_api.register);






// Route to handle login request








module.exports = router;