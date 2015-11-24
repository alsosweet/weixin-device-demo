var path = require('path');
var express = require('express');
var weixin = require('./util/weixin');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 微信公众号配置的URL 路由
app.use('/wechat', weixin.trap);

// H5页面需要的接口（获取签名）
require('./route/handle');

// H5 的demo页面
app.get('/*', function(req, res, next){
  res.render('index');
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* jshint unused:false */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      env: 'development',
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

var server = app.listen(app.get('port'), function(a, b){
  console.log('weixin server listening on port ' + server.address().port);
});
