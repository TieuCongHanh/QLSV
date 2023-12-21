const { Types } = require('mongoose');
var diemModel = require('../models/agile.models');
var msg = '';

exports.list = async(req, res, next) => {
    let listDiem = await diemModel.markModel.find().sort({diemThi: 1}).populate('id_monHoc');
    res.render('diem/list', {list: listDiem, req: req});
}

exports.listDiem = async(req, res, next) => {
    let idlop = req.params.idlop;
    const objClass = await diemModel.classModel.findById(idlop);

    let idMH = req.params.idMH;
    
    const objSubject = await diemModel.subjectModel.findById(idMH);
    
    let listDiem = await diemModel.markModel.find({id_lop : idlop, id_monHoc: idMH}).populate('id_monHoc').populate('id_sv').populate('id_lop');

    console.log(listDiem, '1234');
    res.render('diem/list', {list: listDiem, req: req, objClass: objClass, objSubject: objSubject});
}


exports.monHoc = async(req, res, next) => {
    let idlop = req.params.idlop;
    const objClass = await diemModel.classModel.findById(idlop);

    let listmH = await diemModel.subjectModel.find();
    res.render('diem/listMH', {list: listmH, objClass : objClass, req: req, msg: msg});
}

  async function addMarkToStudent(subjectId, classId , studentId, diemQuiz, diemLab, diemASM, diemThi) {
    try {
        // Tìm object của môn học trong bảng subjectModel
    const subject = await diemModel.subjectModel.findById(subjectId);
    if (!subject) throw new Error('Subject not found');

    // Tìm object của lớp học trong bảng classModel
    const lopHoc = await diemModel.classModel.findById(classId);
    if (!lopHoc) throw new Error('Class not found');

    // Tìm thông tin sinh viên trong danh sách sinh viên của lớp học
        let student = await diemModel.markModel.findOne({ id_sv: studentId, id_lop: classId , id_monHoc : subjectId});
        if(!student){
            const newMark = new diemModel.markModel({
                diemQuiz: diemQuiz,
                diemLab: diemLab,
                diemASM: diemASM,
                diemThi: diemThi,
                id_monHoc: subjectId,
                id_lop : classId,
                id_sv : studentId
                });
                await newMark.save();

          console.log(newMark, "Cập nhật điểm");
          return true;
        }else{
            console.log("Sinh viên này đã có điểm trong môn học này");
            
            return false;
        }
    } catch (error) {
      throw error;
    }
  }
  
exports.add = async(req, res, next) => {
    let idlop = req.params.idlop;
    const objClass = await diemModel.classModel.findById(idlop);

    let listSV = await diemModel.studentListModel.find({id_lop : { $in: [new Types.ObjectId(objClass._id)]}})
    .populate('id_sv')
    .populate('id_diem')
    .populate('id_lop');

    console.log(listSV, '1221');
    let idMH = req.params.idMH;
    const objSubject = await diemModel.subjectModel.findById(idMH);
    let msg = '';

    if(req.method == 'POST'){
            console.log(req.body , 'Giá trị Body');
            console.log(req.body.sinhVien, 'Sinh Viên');
            // Parse đối tượng Sinh viên từ giá trị được submit
           
            if(!req.body.sinhVien || req.body.sinhVien === undefined || req.body.sinhVien === null){
                msg = 'Không có sinh viên trong lớp học này.'
            }else{
            try{
                const sv = JSON.parse(req.body.sinhVien);
                const studentList = await addMarkToStudent(idMH , idlop, sv._id, req.body.diemQuiz, req.body.diemLab, req.body.diemASM, req.body.diemThi);
                console.log(studentList,'LIstVINH VIEN');
                if (studentList) {
                msg = 'Thêm thành công';
                } else {
                    msg = 'Sinh viên này đã có điểm trong môn học này.'
                }
            } catch (err){
                msg = 'Thêm thất bại' + err
                console.log(err);
            }
        }
    }
    res.render('diem/add', {req: req, msg: msg, listSV: listSV, objSubject:objSubject , objClass: objClass});
}



exports.update = async(req, res, next) => {
    let idlop = req.params.idlop;
    const objClass = await diemModel.classModel.findById(idlop);

    let idMH = req.params.idMH;
    const objSubject = await diemModel.subjectModel.findById(idMH);

    let msg = '';
    let idDiem = req.params.id;
    let objDiem = await diemModel.markModel.findById(idDiem).populate('id_sv').populate('id_monHoc').populate('id_lop');
    if(req.method == 'POST'){
        let objDiem = new diemModel.markModel();
        objDiem.diemQuiz = req.body.diemQuiz;
        objDiem.diemLab = req.body.diemLab;
        objDiem.diemASM = req.body.diemASM;
        objDiem.diemThi = req.body.diemThi;
        objDiem.id_monHoc = req.body.tenMH;
        objDiem.id_lop = objClass._id;
        objDiem._id = idDiem;
        try{
            await diemModel.markModel.findByIdAndUpdate(idDiem, objDiem);
            msg = 'Sửa thành công';
        } catch (err){
            msg = 'Sửa thất bại'
            console.log(err);
        }
    }
    res.render('diem/edit', {req: req, msg: msg, objDiem: objDiem, objClass:objClass, objSubject: objSubject});
}

exports.delete = async (req, res, next) => {
    try {
        let idDiem = req.params.id
        let idlop = req.params.idlop;

        let idMH = req.params.idMH;
      // Tìm ID của document điểm đang muốn xóa trong bảng studentListModal
      const studentListObj = await diemModel.studentListModel.findById(req.params.id);
  
      // Xóa document điểm trong bảng markModel với ID tương ứng
      await diemModel.markModel.findByIdAndDelete(idDiem);
      // Cập nhật lại document trong bảng studentListModal của sinh viên tương ứng
      if(studentListObj){
        studentListObj.id_diem = [];
        await studentListObj.update();
      }
      
      res.redirect(`/diem/${idlop}/listMH/${idMH}`);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
