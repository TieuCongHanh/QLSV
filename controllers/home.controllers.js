const md = require('../models/user.models');
const myModel = require('../models/agile.models');
const bcrypt = require('bcrypt');
var msg = '';
exports.home = async (req, res, next) => {

    let countUser = await md.userModel.countDocuments({});
    let countSudent = await myModel.studentListModel.countDocuments({});

    console.log(`Tổng số user: ${countUser}`,`Tổng số sinh viên: ${countSudent}`);

    res.render('home/home', {req : req , msg: msg, countUser: countUser, countSudent:countSudent});
}


exports.Login = async (req, res, next) => {
    let msg='';
    if(req.method == 'POST'){
        try {
            const { user, password } = req.body;
            // Find user by email
            const user1 = await md.userModel.findOne({ user });
            if (!user1) {
                return res.render('home/dn',{msg: 'Tài khoản không đúng vui lòng đăng nhập lại.',req: req});
            }
            else if (password !== user1.password) {
                return res.render('home/dn',{msg: 'Bạn nhập sai mật khẩu vui lòng đăng nhập lại.',req: req});
            }
            else if(user1 && password == user1.password){
            console.log("Đăng nhập thành công.");
            req.session.userLogin=user1;
             return res.redirect('/');
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
          }
    }
    return res.render('home/dn', { msg: msg , req : req});  
}

exports.Reg = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        console.log(req.body);
        // kiểm tra hợp lệ dữ liệu
        if (req.body.password != req.body.passwd2) {
            msg = 'Xác nhận mật khẩu không trùng khớp.';
            return res.render('home/dk', { msg: msg });
        } else {
           // const salt = await bcrypt.genSalt(10);
            let objU = new md.userModel();
            objU.user = req.body.user;
            objU.password = req.body.password;
            objU.img = req.body.img;
            objU.email = req.body.email;
            objU.vaitro = req.body.vaitro;
           // objU.password= await bcrypt.hash(req.body.password,salt);
            try {
                await objU.save();
                msg = 'Đăng ký thành công.';
            } catch (error) {
                msg = error.message;
            }
        }
    }
    res.render('home/dk', { msg: msg });
}
exports.Logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
}
