const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const { google } = require('googleapis');
const CLIENT_ID = keys.oAuth.clientId
const CLIENT_SECRET = keys.oAuth.clientSecret
const REDIRECT_URI = keys.oAuth.redirectUri
const REFRESH_TOKEN = keys.oAuth.refreshToken

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

module.exports.sendMail = async (to, subject, html) => {
    try {
      const accessToken = await oAuth2Client.getAccessToken()
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'patrick.markin-yankah@amalitech.org',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken
        }
      })
  
      const mailOptions = {
        from: 'PMY <pmyarashi@gmail.com>',
        to,
        subject,
        html
        // attachments: [
        //   {   // use URL as an attachment
        //       filename: 'QRcode.png',
        //       path: visitor.qrcode
        //   }
//   ]

      };
  
      const result = await transport.sendMail(mailOptions)
      return result
    } catch (error) {
      return error
    }
  }

module.exports.sendMailTemplate0 = (name) =>{
    return `<h1>Hello ${name}, your account has been successfully created. Welcome to the Amali-eats community.</h1>
    <h1>You should recieve a notification on your account being authorized within the next 24 hours</h1>`
}

module.exports.sendMailTemplate1 = (name) =>{
  return `<h1>Hello ${name}. You have just been added to the Amali-eats community.</h1>`
}

module.exports.sendMailTemplate2 = (email, passwordResetUrl, token) =>{
    return `<h1>Hello ${email}. Please clck on the link below to create a new password.</h1>
    <a href="${passwordResetUrl}">${token}</a>`
}

module.exports.sendMailTemplate3 = (name, quantity, meal) =>{
  return `<h1>Hello ${name}. Your order of ${quantity} serving(s) of ${meal} has been completed and will be delivered within the next hour.</h1>`
}

module.exports.sendMailTemplate4 = (name, quantity, meal) =>{
  return `<h1>Hello ${name}. Your order of ${quantity} serving(s) of ${meal} has been successfully placed. You will be notified when your order ready</h1>`
}

module.exports.sendMailTemplate5 = (name) =>{
  return `<h1>Hello ${name}. Your account has been validated. Welcome to the Amali-eats community.</h1>`
}

{/* <img src="../templates/images/LOGO-NAV1.png" alt="logo" style="width: 30%;"></img> */}
module.exports.sendMailTemplate = (email, verifyUrl) =>{
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; background-color:#f4f4f4;">
      <div style="background-color: white; margin-right: 20%; margin-left: 20%; margin-top: 3%;">
      <div style="text-align: center;">
      <div class="nav" style="background-color: #0C4767; text-align: center;">
          <img src="https://drive.google.com/file/d/1n-B4evVMyuPRORc5QEx9bLDb5Zrvu-iq/view?usp=sharing" alt="logo" style="width: 30%;">
      </div>
      <div>
          <h2 style="text-align: center; padding-top: 50px;">
              Verify your email address to complete the registration
          </h2>
      </div>
      <div style="text-align: left; padding-top: 30px;padding-left: 80px; padding-right: 80px;">
          <p>
              Hi ${email},
          </p>
          <P style="padding-top: 30px;">
              Thanks for the interest in joining Connect. To complete your registration, we need you  to verify your email address. Click the button below to confirm your account.
          </P>
      </div>
     <div style="padding-top: 30px;padding-bottom: 30px;">
         <button style="background-color: #A41201; color: white; border: none; padding: 15px; padding-left: 50px; padding-right: 50px;border-radius: 5px;">
         <a href="${verifyUrl}">Confirm Account</a>
         </button>
     </div>
     <hr  style="opacity: 0.3;" width="82%">
     <div>
         <p style="font-weight: 800; text-align: left; padding-left: 80px; padding-right: 80px;">Need Help?</p>
         <p style="text-align: left; padding-left: 80px; padding-right: 80px;padding-bottom: 50px;">
             Feel free to send us an email or  call  us to talk to our support. We will be happy to resolve all your issues
         </p>
     </div>
     
     
  </div>
</div>
  </body>`
}