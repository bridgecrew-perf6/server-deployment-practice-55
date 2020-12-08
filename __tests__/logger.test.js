const loggerMiddleware = require('../lib/logger');

describe('logger middleware', () => {
  let consoleSpy;
  let req = {};
  let next = jest.fn(); //spy on the next method

  beforeEach(() => {
    //attach to the console
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  })


  afterEach(() => {
    //put the console back
    consoleSpy.mockRestore();
  });

  it ('properly logs some output', () => { 
    loggerMiddleware(req, res, next);
    expect(consoleSpy).toHaveBeenCalled();
  })

})

