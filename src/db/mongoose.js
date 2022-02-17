const mongoose = require('mongoose')

const connectionURL = process.env.MONGOOSE_CONNECTION

console.log(connectionURL);
mongoose.connect(connectionURL,
    {
        useNewUrlParser:true,
        useCreateIndex:true
    })

