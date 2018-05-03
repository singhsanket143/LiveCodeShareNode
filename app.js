var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

require('./passport');
var config = require('./config');

var indexRoute = require('./routes/index');
var authRoute = require('./routes/auth');
var taskRouter = require('./routes/task');

mongoose.connect(config.dbConnstring);
global.User = require('./models/user');
global.Task = require('./models/task');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());
app.use(session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    if(req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
});

app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', taskRouter);

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

module.exports = app;
