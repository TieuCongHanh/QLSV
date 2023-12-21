var express = require('express');
var router = express.Router();
var homeCtrl = require('../controllers/home.controllers');
var check_login = require('../middlewares/check_login');


router.use( (req, res, next) => {
    console.log("---- Dòng này là middleware ---- ");
    next();
});

router.get('/',check_login.yeu_cau_dang_nhap, homeCtrl.home);

router.get('/dn',check_login.da_dang_nhap, homeCtrl.Login );
router.post('/dn',check_login.da_dang_nhap, homeCtrl.Login );

router.get('/dk',check_login.da_dang_nhap, homeCtrl.Reg );
router.post('/dk',check_login.da_dang_nhap, homeCtrl.Reg );
router.post('/logout', homeCtrl.Logout);


module.exports = router;
