const mongoose = require('mongoose')

const connectionURL = process.env.MONGOOSE_CONNECTION
    //mongo DB Connection
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true
})