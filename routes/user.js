var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user.controllers');
const bodyParser = require('body-parser');
var check_login = require('../middlewares/check_login');
const multer  = require('multer')
const upload = multer({ dest: './tmp' })

router.use( (req, res, next) => {
    console.log("---- Dòng này là middleware ---- ");
    next();
});



router.use(bodyParser.urlencoded({extended:false}));
router.get('/:i',check_login.yeu_cau_dang_nhap, userCtrl.list);
router.get('/',check_login.yeu_cau_dang_nhap, userCtrl.list);

router.get('/:i/add', upload.single("productImage"),check_login.yeu_cau_dang_nhap, userCtrl.add);
router.post('/:i/add', upload.single("productImage"),check_login.yeu_cau_dang_nhap, userCtrl.add);

//edit
router.get('/edit/:id',upload.single("productImage"),check_login.yeu_cau_dang_nhap, userCtrl.edit);
router.post('/edit/:id',upload.single("productImage"),check_login.yeu_cau_dang_nhap, userCtrl.edit);


//delete
router.post('/delete',userCtrl.deleteUser);
router.get('/:user',check_login.yeu_cau_dang_nhap, userCtrl.list)


module.exports = router;
