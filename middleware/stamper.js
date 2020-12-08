'use strict';

//middleware can add things onto the request object

module.exports = (req, res, next) => {
  //stop request object, add a property called "timeStamp" with the value of new Date()
  req.timeStamp = new Date();
  //as long as don't give next() and argument it will move to the next middleware argument
  next();
}
