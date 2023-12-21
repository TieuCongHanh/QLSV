var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var usersRouter = require('./routes/user');
var sinhVienRouter = require('./routes/sinhVien');
var homeRouter=require('./routes/home');
var lopRouter = require('./routes/lop');
var monHocRouter = require('./routes/monHoc');
var diemRouter = require('./routes/diem');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'KNDHA93sf2nfskfHNDHflsnr53jsg3hgsmdnsdg',
  resave: true,
  saveUninitialized: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/user', usersRouter);
app.use('/sinhVien',sinhVienRouter);
app.use('/home', homeRouter);
app.use('/lop', lopRouter);
app.use('/monhoc', monHocRouter);
app.use('/diem', diemRouter);



app.use(express.static("images"));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  // địa chỉ truy cập bằng api:   /api/xxxx
 if(req.originalUrl.indexOf('/api') ==0 ){
   res.json(
     {
       msg: err.message
     }
   );
 }else{
   res.render('error');
 }
 // thử truy cập địa chỉ web:   http://localhost:3000/api và http://localhost:3000/xyz 
 
 process.on('uncaughtException', function (err) {
  console.log(err);
});

  res.render('error');
});

module.exports = app;
