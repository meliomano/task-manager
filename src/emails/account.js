const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const message = {
        to: email,
        from: 'elioperez.conde@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }
    
    sgMail.send(message)
}

const sendGoodbyeEmail = (email, name) => {
    const message = {
        to: email,
        from: 'elioperez.conde@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    }

    sgMail.send(message)
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}