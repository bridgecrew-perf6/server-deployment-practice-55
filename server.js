'use strict';

// libraries
require('dotenv').config();
const express = require('express'); // server
const app = express();
//const PORT = process.env.PORT || 3000;

//body parser that accepts json
app.use(express.json());


// local files
const notFoundHandler = require('./handlers/404');
const errorHandler = require('./handlers/500');
const stamper = require('/middleware/stamper');


// routes
app.get('/', renderHome);
app.get('/data', stamper, renderData);
app.get('/bad', (req, res, next) => {
  // anytime you put anything inside of the next(), it will throw an error
  next('you messed up');
})

//query
app.get('/fruit', (req, res) => {
  let output = {
    type: req.query.type
  }
  res.status(200).json(output);
})

// param
app.get('/fruit/:type', (req, res) => {
  let output = {
    type: req.params.type
  }

  res.status(200).json(output);
})

//body
app.post('/fruit', (req, res) => {
  console.log('what got added', req.body);
  res.status(200).send('ok');
})

//update the body
app.put('/fruit', (req, res) => {
  console.log('what got updated', req. body);
  res.status(201).send('ok');
})


// whenever someone throws an error, use the function errorHandler
app.use(errorHandler);

//middleware

//middleware functions
// 1. all good - next()
// 2. not good - next('message') - throw an error
// 3. deal with it yourself - don't call next, deal with response object

//log a request
const logRequest = require('.middleware/logger');

//adds browser to the request object
function getBrowser(req, res, next) {
  req.browser = req.headers['user-agent'];
  next();
}

//sends the request object with the browser key to the front end
app.get('/browser', getBrowser, (req, res) => {
  let output = {
    browser: requestAnimationFrame.browser
  }
  res.status(200).json(output);
})

function square(n) {
  return (req, res, next) => {
    if(typeof n !== 'number'){
      next('Not a number'); //will skip rest of the middleware
    } else {
      req.number = n * n;
      next();
    }
  }
}

app.get('/mw', square(10), getBrowser, (req, res) => {
  let output = {
    browser: req.browser,
    number: req.number
  }
  res.status(200).json(output);
})

//CRUD Create Read Update Delete

let db =[];

// {
//   id:12,
//   type: 'banana',
// }

//get all

app.get('/api/v1/food', (req, res, next) => {
  const count = db.length;
  const results = db;
  res.status(200).json({count, results}); //shorthand for .json({count: count, results: results})
})

//get one

app.get('/api/v1/food/:id', (req, res, next) => {
  const id = req.params.id;

  const record = db.find(food => food.id === parseInt(id));

  res.json(record);
})

//create

app.post('/api/v1/food', (req, res, next) => {
// create a new object with key of 'name', the value of that key will be req.body.name
  let record = { name: req.body.name};
  record.id = db.length + 1;
  db.push(record);
  res.status(200).json(record);
}
)

//update

app.put('/api/v1/food/:id', (req, res, next) => {
  const idToUpdate = req.params.id;
  let { name, id } = req.body;
  let updatedRecord = { name, id };
  db = db.map(record => record.id === parseInt(idToUpdate));
  res.status(200).json(updatedRecord);
})

//delete

app.delete('/api/v1/food/:id', (req, res, next) => {
  const id = req.params.id;
  db = db.filter(food => food.id !== parseInt(id));
  res.status(204).send('ok');
})




//express works by saying 'use this function as a piece of middleware
//this will apply to all routes
app.use(logRequest);

app.use('*', notFoundHandler);






// callback functions
function renderHome(req, res){
  res.status(200).send('Hello World');
}

function renderData(req, res, next){
  const outputObj = {
    10: 'even',
    5: 'odd',
    'time': req.timeStamp
  }

  res.status(200).json(outputObj);
}


// turning server on
function start(PORT) {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
}

module.exports = {
  app: app,
  start: start
}
