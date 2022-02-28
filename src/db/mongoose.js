const mongoose = require('mongoose')

const connectionURL = process.env.MONGOOSE_CONNECTION
mongoose.connect(connectionURL,
    {
        useNewUrlParser:true,
        useCreateIndex:true
    })

