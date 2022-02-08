const AppError = require('./../utils/appError');


const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 200);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 200);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 200);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 200);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 200);
  
const sendErrorDev = (err,res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
}

const sendErrorProd = (err,res) => {
	if(err.isOperational){
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	}else{
		//console.error('ERROR: ', err);
		res.status(200).json({
			status: 'error',
			message: 'Something went wrong!'
		});
	}
}


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 200;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = Object.assign(err);
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};