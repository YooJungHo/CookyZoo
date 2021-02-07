var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //콘솔에 나오는 GET / 200 51.267 ms -1523 등의 요청에 대한 정보를 콘솔에 로깅해줌.
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup, app.set()으로 익스프레스 앱 설정 가능.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//미들웨어 연결하는 부분
app.use(logger('dev')); //보통 개발시에는 short나 dev를 쓰고, 배포 시에는 common이나 combined를 사용.

//요청의 본문을 해석(보통 폼 데이터나 Ajax 요청의 데이터 처리)해주는 미들웨어 body-parser가 express 내부로 내장됨.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//요청에 동봉된 쿠키 해석
app.use(cookieParser());

// sass css preprocessor 미들웨어
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

// 정적인 파일 제공, 실행해보고 이상 없으면 morgan 바로 아래인 20번 라인으로 위치 이동시킬 것. p.279
app.use(express.static(path.join(__dirname, 'public')));


//라우터 부분, app.use를 사용하므로, 라우터도 일종의 미들웨어. /users는 routes/users.js를 호출하라는 의미.
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.render('error');
});

module.exports = app; //app 객체를 모듈로 생성, 이것이 bin/www에서 사용된 app 모듈임.
