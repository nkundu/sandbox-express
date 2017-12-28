

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var config = require('./config.json');

var routes = require('./routes/index');
var users = require('./routes/user');
var stocks = require('./routes/stock');
var prettygit = require('./routes/prettygit');
var kalman = require('./routes/kalman');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
app.locals.moment = require('moment');

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.header('X-Xss-Protection', '1; mode=block');
    res.header('X-Content-Type-Options', 'nosniff');
    res.removeHeader('X-Powered-By');
    next();
});
app.use(cookieSession({
    name: 'session',
    keys: config.sessionKeys
}));

app.use('/', routes);
app.use('/static', express.static('static'));
app.use('/users', users);
app.use('/stock', stocks);
app.use('/prettygit', prettygit);
app.use('/kalman', kalman);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
