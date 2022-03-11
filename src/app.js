const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')
const app = express()
const i18next = require('i18next')
const backend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//swagger midddlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//middlewares declaration for i18
i18next.use(backend).use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        backend: {
            loadPath: './locales/{{lng}}/translation.json'
        }
    })
app.use(middleware.handle(i18next))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
module.exports = app;