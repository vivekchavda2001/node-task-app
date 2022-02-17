const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeMail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'chavdavivek2001@gmail.com',
        subject:'Thanks For Joining In!!!',
        cc:'iamnotbot98@gmail.com',
        text:`Welcome to the app, ${name}.Stay Connected For latest update`,    
    })
}

const sendCancelMail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'chavdavivek2001@gmail.com',
        subject:'Pardon For inconvenience',
        text:`Thanks For choosing us, ${name}.We will miss you.`,    
    })
}


module.exports = {
    sendWelcomeMail,
    sendCancelMail
}