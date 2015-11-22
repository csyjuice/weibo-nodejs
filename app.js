var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');
var register = require('./routes/register');  //引入路由逻辑
var messages = require('./lib/messages');
var login = require('./routes/login');
var user = require('./lib/middleware/user');
var entries = require('./routes/entries');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(express.methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.cookieParser('bruce'));
app.use(cookieParser());
app.use(express.session());
app.use('/api', api.auth);
app.use(user);  //将中间件添加到程序中
app.use(messages);
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use(routes.notfound);

app.get('/', page(Entry.count, 5), entries.list);
app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/post', entries.form);
app.post('/post',
    validate.required('entry[title]'),
    validate.lengthAbove('entry[title]', 4),
    entries.submit
);
app.get('/api/user/:id', api.user);
//app.get('/api/entries/:page?', api.entries);
app.post('/api/entry',
    validate.required('entry[title]'),
    validate.lengthAbove('entry[title]', 4),
    entries.submit
);
app.get('/api/entries/:page?', page(Entry.count, 5), api.entries);


/// catch 404 and forwarding to error handler
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

if (process.env.ERROR_ROUTE) {
    app.get('/dev/error', function(req, res, next){
        var err = new Error('database connection failed');
        err.type = 'database';
        next(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;