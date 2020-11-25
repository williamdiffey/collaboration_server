const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function mailer(user) {
  try {
    console.log('connected')

    const transporter = nodemailer.createTransport({
      host: 'smpt.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const EMAIL_SECRET = process.env.EMAIL_SECRET
    const emailToken = jwt.sign({ user: user.id }, EMAIL_SECRET, {
      expiresIn: '1d',
    })
    // use path or env to fix this
    const url = `http://localhost:3000/confirmation/${emailToken}`

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Collaborate account confirmation',
      html: `<p>Welcome to Collaborate. 
            <br/>
            To activate your account and find likeminded creators just click the link below:
            <a href=$"{url}">Click here to verify your Collaborate account</a>
            `,
    }

    transporter.sendMail(mailOptions, (err, data) => {
      if (error) {
        console.log('There was an error', error)
      } else 'Email sent'
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { mailer }
