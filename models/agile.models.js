var db = require('./db');

const studentSchema = new db.mongoose.Schema(
    {
        MSSV : {type: String, require: true},
        tenSV: {type: String, require: true},
        gioiTinh: {type: String, require: true},
        ngaySinh: {type: String, require: true}
    },
     {collection: 'sinhVien'}
);
let studentModel = db.mongoose.model('studentModel', studentSchema);

const classSchema = new db.mongoose.Schema(
    {
        tenLop: {type: String, require: true}
    }, 
    {collection: 'lop'}
);
let classModel = db.mongoose.model('classModel', classSchema);

const markSchema = new db.mongoose.Schema(
    {
        id_lop: {type: db.mongoose.Schema.Types.ObjectId, ref: 'classModel'},
        id_sv: {type: db.mongoose.Schema.Types.ObjectId, ref: 'studentModel'},
        diemQuiz: {type: Number, require: true},
        diemLab: {type: Number, require: true},
        diemASM: {type: Number, require: true},
        diemThi: {type: Number, require: true},
        id_monHoc: {type: db.mongoose.Schema.Types.ObjectId, ref: 'subjectModel'}
    }, 
    {collection: 'diem'}
);
let markModel = db.mongoose.model('markModel', markSchema);

const subjectSchema = new db.mongoose.Schema(
    {
        tenMH: {type: String, require: true},
        tinChi: {type: Number, require: true}
    }, 
    {collection: 'monHoc'}
);
let subjectModel = db.mongoose.model('subjectModel', subjectSchema);

const studentListSchema = new db.mongoose.Schema(
    {
        id_lop: {type: db.mongoose.Schema.Types.Array, ref: 'classModel'},
        id_sv: {type: db.mongoose.Schema.Types.ObjectId, ref: 'studentModel'},
        id_diem: {type: db.mongoose.Schema.Types.ObjectId, ref: 'markModel'},
    }, {collection: 'dsSinhVien'}
);
studentListSchema.pre("remove", async function (next) {
    try {
      // Tìm object của sinh viên trong bảng studentModel
      const student = await studentModel.findById(this.id_sv);
      if (!student) return next();
  
      // Xóa object của sinh viên trong bảng studentModel và các object liên quan trong bảng markModel
      await markModel.deleteOne({ _id: this.id_diem });
      await student.remove();
  
      return next();
    } catch (error) {
      return next(error);
    }
  });
  
let studentListModel = db.mongoose.model('studentListModel', studentListSchema);

module.exports = {studentListModel, studentModel, classModel, markModel, subjectModel}