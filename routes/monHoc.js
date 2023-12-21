var express = require('express');
var router = express.Router();
var mHCtrl = require('../controllers/monhoc.controller');
var check_login = require('../middlewares/check_login');


router.use( (req, res, next) => {
    console.log("---- Dòng này là middleware ---- ");
    next();
});


router.get('/',check_login.yeu_cau_dang_nhap, mHCtrl.list);
router.get('/locID/:idtl',check_login.yeu_cau_dang_nhap,mHCtrl.list)

router.get('/add',check_login.yeu_cau_dang_nhap, mHCtrl.add);
router.post('/add',check_login.yeu_cau_dang_nhap, mHCtrl.add);

router.get('/edit/:idmh',check_login.yeu_cau_dang_nhap, mHCtrl.update);
router.post('/edit/:idmh',check_login.yeu_cau_dang_nhap, mHCtrl.update);

//delete
router.post("/delete",check_login.yeu_cau_dang_nhap, mHCtrl.delete);


module.exports = router;
