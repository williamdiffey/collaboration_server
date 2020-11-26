const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function mailer(user) {
  try {
    console.log('connected')

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      // secure: false,
      // requireTLS: true,
      auth: {
        user: 'gwendolyn.ritchie22@ethereal.email',
        pass: 'fnFA1C7aPJzpp2F2Cs',

        // user: process.env.EMAIL_USER,
        // pass: process.env.EMAIL_PASS,
      },
    })

    const EMAIL_SECRET = process.env.EMAIL_SECRET
    const emailToken = jwt.sign({ user: user.id }, EMAIL_SECRET, {
      expiresIn: '1d',
    })
    // use path or env to fix this
    const url = `http://localhost:3000/confirmation/${emailToken}`

    let mailOptions = {
      from: 'prekursorrecords@gmail.com',
      to: user.email,
      subject: 'Collaborate account confirmation',
      html: `<p>Welcome to Collaborate. 
            <br/>
            To activate your account and find likeminded creators just click the link below:
            <a href=${url}>Click here to verify your Collaborate account</a>
            `,
    }

    transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log('There was an error', error)
      } else `Email sent ${emailToken}`
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { mailer }
