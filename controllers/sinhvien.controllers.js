var myModel = require('../models/agile.models');

var msg='';

exports.list = async(req, res, next) => {
     msg = '';
    let timKiem = null;
    let regex = new RegExp(req.query.MSSV, "i"); 

    if (req.query.MSSV != '' && String(req.query.MSSV) != 'undefined') {
        let student = await myModel.studentModel.findOne({ MSSV: regex });
        if(student){
            timKiem = { id_sv: student._id };
        }else{
            timKiem = null;
        }
    }
    if(req.query.MSSV == 'PH' || req.query.MSSV == 'pH' || req.query.MSSV == 'pH' || req.query.MSSV == 'ph'){
        timKiem = null;
    }
    let listds = await myModel.studentListModel.find(timKiem).populate('id_sv').populate('id_diem').populate('id_lop').sort({'id_sv.MSSV' : 1});

    res.render('sinhvien/list', {req: req, msg: msg, list: listds});
}

exports.add = async(req, res, next) => {
     msg = '';
    if(req.method == 'POST'){

        try {
            // Lấy danh sách tất cả các MSSV đã tồn tại
            const existingStudents = await myModel.studentModel.find().select('_id');
        
            let MSSV;
        
            while (true) {
              // Tạo MSSV ngẫu nhiên
              const randomNumber = Math.floor(Math.random() * 100000);
                MSSV = 'PH' + String(randomNumber).padStart(5, '0');  // luôn lấy chuỗi 5 số sau PH
        
         // Kiểm tra xem MSSV mới tạo có bị trùng lặp không
              const existingMSSV = existingStudents.some(student => student._id === MSSV);
              if (!existingMSSV) break; // Nếu không trùng lặp, thoát vòng lặp
            }
            // Gán giá trị MSSV vào _id
            const newStudent = new myModel.studentModel({ MSSV: MSSV, tenSV : req.body.tenSV , gioiTinh : req.body.gioiTinh, ngaySinh : req.body.ngaySinh});

            let objStdList = new myModel.studentListModel();
            objStdList.id_sv = newStudent._id;

            // Lưu tài khoản mới vào cơ sở dữ liệu
            await newStudent.save();
            await objStdList.save();
            msg = 'Thêm thành công';
          } catch (error) {
            msg = 'Thêm thất bại'
            console.log(error);
          }
        
        
    }
    res.render('sinhvien/add', {req: req, msg: msg});
}

exports.edit = async(req, res, next) => {
     msg = '';
    let idsv = req.params.idsv;
    let objStudent = await myModel.studentModel.findById(idsv);
    if(req.method == 'POST'){
        let objStudent = new myModel.studentModel();
        objStudent.tenSV = req.body.tenSV;
        objStudent.gioiTinh = req.body.gioiTinh;
        objStudent.ngaySinh = req.body.ngaySinh;
        objStudent._id = idsv;
        try{
            await myModel.studentModel.findByIdAndUpdate(idsv, objStudent);
            msg = 'Sửa thành công';
        } catch (err){
            msg = 'Sửa thất bại';
            console.log(err);
        }
    }
    res.render('sinhvien/edit', {req: req, msg: msg, objStudent: objStudent});
}

exports.delete= async (req,res,next)=>{
    const studentList = await myModel.studentListModel.findById(req.body.IdDelete);
    if (!studentList) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy document' });
    }

    console.log(studentList, "XÓA SINH VIÊN NÀY");
    // Xóa document sinh viên trong collection "studentModel   
    await myModel.studentModel.deleteOne({_id: studentList.id_sv});

    // Xóa document liên quan trong collection "markModel"
    await myModel.markModel.deleteMany({_id: studentList.id_diem});
    await myModel.markModel.deleteMany({id_sv: studentList.id_sv});
    
    // Xóa document sinh viên trong collection "studentListModel"
    await myModel.studentListModel.deleteOne({_id: req.body.IdDelete});
    
    res.redirect('/sinhVien');  
}

exports.chiTiet = async (req,res,next)=>{
    let id = req.params.idsv;

    const objStudent = await myModel.studentModel.findById(id);

    const objMark = await myModel.markModel.find({id_sv : id}).populate('id_sv').populate('id_monHoc').populate('id_lop');
    
    
    if (!objStudent) {

        return res.status(404).json({ success: false, message: 'Không tìm thấy document' });
    }

    
    res.render('sinhVien/detail',{req: req, msg: msg , objStudent: objStudent, list : objMark});  
}