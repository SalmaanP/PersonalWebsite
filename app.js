var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/users', users);

app.get('/', function(req, res){


    writeLog('home', req);
    res.render('new_home');
});

app.get('/test', function(req, res){
    writeLog('test', req);
    res.render('home');
});

app.get('/resume', function (req, res) {
    writeLog('resume', req);
    var filePath = "/public/salmaan.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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



function writeLog(type, req){


    fs.appendFile('visitlog.txt', type + ',' + new Date() + ',' + (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0] + '\n', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });


}

module.exports = app;
