const express = require('express');
const fs = require('fs');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const AppError = require('./app/utils/appError');
const errorController = require('./app/controllers/errorController');
const userRouter = require('./app/routes/userRoutes');


// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
//app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', userRouter);


app.all('*', (req,res,next) => {
	next(new AppError('Page not found', 404));
});

app.use(errorController);

module.exports = app;