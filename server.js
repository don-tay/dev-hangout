const express = require('express');
const colors = require('colors');
const morgan = require('morgan');

const connectDB = require('./config/db');

// Route files
const apiRoutes = require('./routes/api/api-routes');

// Init express
const app = express();

// Connect to db
connectDB();

// JSON parser middleware
app.use(express.json({ extended: false }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => res.send(`API Running`));

// Mount routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
