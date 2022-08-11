const AppError = require('../utils/appError')


const handleJWTError = () => new AppError('Invalid token, please log in again!', 401)

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

function handleDuplicateFieldDB(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*\\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value`
  return new AppError(message, 400);
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(err => err.message)
  const message = `Invalid input data. ${errors.join(`.\n `)}`
  return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  if (err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.statusMessage
    })
  }
  else{
    console.error('Error', err)

    res.status(500).json({
      status: 'error',
      message: 'something went very wrong'
    })
  }

}


const handleJWTExpiredError = () => new AppError('Token expired, please log in again', 401)


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development'){
    sendErrorDev(err, res)
  }
  else if (process.env.NODE_ENV === 'production'){
    let error = { ...err }
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebToken') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()
    sendErrorProd(error, res)
  }

  next();
}
