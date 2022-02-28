"use strict";

var express = require('express');

require('./db/mongoose');

var userRouter = require('./router/userRouter');

var taskRouter = require('./router/taskRouter');

var app = express();

var i18next = require('i18next');

var backend = require('i18next-fs-backend');

var middleware = require('i18next-http-middleware');

i18next.use(backend).use(middleware.LanguageDetector).init({
  fallbackLng: 'en',
  backend: {
    loadPath: './locales/{{lng}}/translation.json'
  }
});
app.use(middleware.handle(i18next));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
module.exports = app;