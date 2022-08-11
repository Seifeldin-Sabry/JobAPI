const morgan = require('morgan')
const express = require('express');
const app = express();
const productRouter = require('./routes/productRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController')

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
app.use(express.static('./public'))
app.use(express.json())


app.get('/', (req, res) => {
    return res.send('<h1>Store API</h1>< href="/api/v1/products">products route>')
})

//tasks middleware assignment
app.use('/api/v1/products', productRouter)

app.all('*',(req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})
app.use(globalErrorHandler)

module.exports = app;