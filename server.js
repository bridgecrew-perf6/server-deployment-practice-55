'use strict';

// libraries
require('dotenv').config();
const express = require('express'); // server
const app = express();
// const PORT = process.env.PORT || 3000;

// local files
const notFoundHandler = require('./handlers/404');
const errorHandler = require('./handlers/500');

// routes
app.get('/', renderHome);
app.get('/data', renderData);
app.get('/bad', (req, res, next) => {
  // anytime you put anything inside of the next(), it will thow an error
  next('you messed up');
})
app.use('*', notFoundHandler);

// whenever someone throws an error, use the function errorHandler
app.use(errorHandler);

// callback functions
function renderHome(req, res){
  res.status(200).send('Hello World');
}

function renderData(req, res, next){
  const outputObj = {
    10: "even",
    5: "odd",
    "time": new Date()
  }

  res.status(200).json(outputObj);
}


// turning server on
function start(port) {
  app.listen(port, () => console.log(`server is listening on ${port}`));
}

module.exports = {
  app: app,
  start: start
}