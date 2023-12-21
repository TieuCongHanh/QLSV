var mHModel = require('../models/agile.models');

exports.list = async(req, res, next) => {
    let msg = '';
    let timKiem = null;
    if (req.query.tenMH != '' && String(req.query.tenMH) != 'undefined') {
        timKiem = { tenMH: req.query.tenMH }
    }
    let list = await mHModel.subjectModel.find(timKiem).sort({tenMH: 1});
    res.render('monHoc/list', {req: req, msg: msg, list: list});
}

exports.add = async(req, res, next) => {
    let msg = '';
    if(req.method == 'POST'){
        let objMH = new mHModel.subjectModel();
        objMH.tenMH = req.body.tenMH;
        objMH.tinChi = req.body.soTinChi;
        try{
            let o = await objMH.save();
            console.log(o);
            msg = 'Thêm thành công';
        } catch (err){
            msg = 'Thêm thất bại'
            console.log(err);
        }
    }
    res.render('monHoc/add', {req: req, msg: msg});
}

exports.update = async(req, res, next) => {
    let msg = '';
    let idmh = req.params.idmh;
    let objMH = await mHModel.subjectModel.findById(idmh);
    if(req.method == 'POST'){
        let objMH = new mHModel.subjectModel();
        objMH.tenMH = req.body.tenMH;
        objMH.tinChi = req.body.soTinChi;
        objMH._id = idmh;
        try{
            await mHModel.subjectModel.findByIdAndUpdate(idmh, objMH);
            msg = 'Sửa thành công';
        } catch (err){
            msg = 'Sửa thất bại'
            console.log(err);
        }
    }
    res.render('monHoc/edit', {req: req, msg: msg, objMH: objMH});
}

exports.delete= async (req,res,next)=>{
    await mHModel.subjectModel.deleteOne({_id: req.body.IdDelete});
    res.redirect('/monHoc');

}