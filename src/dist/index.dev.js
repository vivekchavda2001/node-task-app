"use strict";

var app = require('./app');

var port = process.env.PORT; //listning server 

app.listen(port, function () {
  return console.log('sever is Running', port);
});