const mongooose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    const conn = await mongooose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB connected on ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.error(err);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
