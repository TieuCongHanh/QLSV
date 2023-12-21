var express = require('express');
var router = express.Router();
var diemCtrl = require('../controllers/diem.controllers');
var check_login = require('../middlewares/check_login');


router.use( (req, res, next) => {
    console.log("---- Dòng này là middleware ---- ");
    next();
});


router.get('/',check_login.yeu_cau_dang_nhap, diemCtrl.list);
router.get('/locID/:idtl',check_login.yeu_cau_dang_nhap, diemCtrl.list)

router.get('/:idlop/listMH',check_login.yeu_cau_dang_nhap, diemCtrl.monHoc)
router.get('/:idlop/listMH/:idMH',check_login.yeu_cau_dang_nhap, diemCtrl.listDiem)

router.get('/:idlop/:idMH/add',check_login.yeu_cau_dang_nhap, diemCtrl.add);
router.post('/:idlop/:idMH/add',check_login.yeu_cau_dang_nhap, diemCtrl.add);



router.get('/:idlop/:idMH/update/:id',check_login.yeu_cau_dang_nhap, diemCtrl.update);
router.post('/:idlop/:idMH/update/:id',check_login.yeu_cau_dang_nhap, diemCtrl.update);

//delete
router.post("/:idlop/:idMH/delete/:id",check_login.yeu_cau_dang_nhap, diemCtrl.delete);


module.exports = router;
