/***************************
app.js file
****************************/

//Express module
const express = require('express');
const bodyParser = require('body-parser');

//Configuration settings
const config = require('./config/config');
const winston = require('./config/winston')
//Logger
const morgan = require('morgan');
//Routes
const transactionRoutes = require('./routes/transaction')

//Initializing the app
const app = express();

//Initializing app with morgan
app.use(morgan('combined',{stream: winston.stream}));
/***************************
Middleware
****************************/
app.use(bodyParser.json());
app.use(transactionRoutes);


// Global Error handler
app.use((error, req, res, next) => {

  //Winston logging
  winston.error(`${error.status || 400} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const status = error.statusCode || 400;
  const message = error.message || "Some error occured";
  res.status(status).json({success:false, error: message });
});


//Starting server
app.listen(config.port,config.hostname);
