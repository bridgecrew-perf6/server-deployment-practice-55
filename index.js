'use strict';

require('dotenv').config();

const server = require('./server');

server.start(3001);
