exports.yeu_cau_dang_nhap =(req, res, next)=>{
    if(req.session.userLogin){
        // có tồn tại session
        next();
    }else{
        // không tồn tại thông tin đăng nhập
        // chuyển sang trang đăng nhập
        res.redirect('/dn');
    }
}
exports.da_dang_nhap =(req, res, next)=>{
    if(req.session.userLogin){
        // có tồn tại session
        res.redirect('/');
    }else{

        next();
    }
}