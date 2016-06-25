

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var routes = require('./routes/index');
var users = require('./routes/user');
var stocks = require('./routes/stock');
var prettygit = require('./routes/prettygit');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

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
app.use(cookieSession({
    name: 'session',
    keys: ['uX86WPv90hWpBpI2uuJC',
           'FLSySQCxO5rBQpYlLrhi',
           'UCrIozbwMlAad8WXsw6G',
           '9BXRCON8lYFx1XcZOJdN',
           'psrVeRvqzw5w2XUsR9HA',
           'OcsARZLxfoJLR9ZsmVVr',
           'qUPwVCqiMI9297amAt0c',
           'dDC3pYrBIl5hVhCjzSsZ',
           'PQDcupZqc604MDdaeP4a',
           'VccX2fyJ9sAo0vfepzuk']
}));

app.use('/', routes);
app.use('/users', users);
app.use('/stock', stocks);
app.use('/prettygit', prettygit);

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
