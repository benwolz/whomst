const mongoose = require("mongoose");
const mongoURL = process.env.DATABASE_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// connects to MongoDB
mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise; 
const dbConnection = mongoose.connection;
// error handler
dbConnection.on('error', console.error.bind(console, 'connection error:'));
// optional: run when connection is successful
dbConnection.on('connected', console.error.bind(console, 'database connected'));

module.exports = dbConnection;

