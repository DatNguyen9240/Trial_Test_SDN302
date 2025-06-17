const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var coursesRouter = require('./routes/courses');
var sessionsRouter = require('./routes/sessions');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SECRET_KEY || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
app.use('/', indexRouter);
app.use('/view/auth', authRouter);
app.use('/view/sessions', sessionsRouter);
app.use('/api/courses', coursesRouter);

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 404 handler
app.use(function(req, res, next) {
  res.status(404).render('error', {
    message: 'Not Found',
    error: { status: 404 }
  });
});

module.exports = app;
