var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var index = require('./routes/index');
var profile = require('./routes/profile');
var ranks = require('./routes/ranks');
var contests = require('./routes/contests');
var assignments = require('./routes/assignments');
var mongoose = require('mongoose');
var session = require('express-session');

//bots
var cfbot = require('./portal-bots/codeforces');
var ccbot = require('./portal-bots/codechef');
var hrbot = require('./portal-bots/hackerrank');
var spbot = require('./portal-bots/spoj');

process.on('unhandledRejection', function(err, promise) {
    console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules',express.static(path.join(__dirname, 'node_modules')));

app.use(session({
  secret: 'notasecretreally',
  saveUninitialized: true,
  resave: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/profile', profile);
app.use('/ranks',ranks);
app.use('/assignments',assignments);
app.use('/contests',contests);
//mongoose
mongoose.connect('mongodb://localhost/infero');
ccbot.codechefCronJob();
cfbot.codeforcesCronJob();
hrbot.hackerrankCronJob();
spbot.spojCronJob();

module.exports = app;
