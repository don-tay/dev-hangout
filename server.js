const express = require('express');
const colors = require('colors');
const morgan = require('morgan');

const connectDB = require('./config/db');

const app = express();

// Connect to db
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => res.send(`API Running`));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
