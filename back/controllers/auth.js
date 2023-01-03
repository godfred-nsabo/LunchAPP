const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken')
const {hashPassword} = require('../helpers/hashPassword')
const { sendMail, sendMailTemplate0, sendMailTemplate2} = require('../helpers/sendMail')

const User = require("../models/user");
const { jwtToken } = require('../helpers/jwt');

module.exports.getLogin = (req, res, next) => {
   return res.send("Login Page");
};

module.exports.getSignup = (req, res, next) => {
   return res.send("SignUp Page");
};

module.exports.postSignup = async(req, res, next) => {
    const name  = req.body.name;
    const email  = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const role = req.body.role

    if (!name || !email || !password || !password2 || !role ) {
        return res.send({ msg: "Please fill in all fields" });
    }

    else if (password !== password2) {
        return res.send({ msg: "Passwords do not match" });
    }

    else if (password.length < 6) {
        return res.send({ msg: "Password must be at least 6 characters" });
    }

    else{
        User.findOne({email})
        .then(async result => {
            if (result) {
                return res.status(400).json({
                    message: 'E-Mail exists already, please pick a different one.'
                });
            } else {
                    const user = new User({
                        name,
                        email,
                        password: await hashPassword(password),
                        role,
                        created_at: new Date(),
                        disabled: true,
                        cart: { items: [] }
                    });
                    user.save()
                    let subject = 'Welcome to Amali-eats'
                    let html = sendMailTemplate0(name)
                      await sendMail(email, subject, html).then(result => console.log('Email sent ...', result))
                        .catch((error) => console.log(error.message))
                    .then(result => {
                        return res.status(201).json({
                          message: `Welcome To Amali-eats ${user.name}. Have A Great Day!`,
                          post: { id: new Date().toISOString() }
                        });
                    });
                
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({message: 'error signing up'})
        });
    }
}

module.exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password){
        return res.status(401).json({msg: "Please fill in all fields"});
    }

    else {
        User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid email or password.'
                })
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(!result) {
                    return res.status(401).json({
                        message: 'Invalid email or password..'
                    })
                } else {
                    if (user.disabled === true){
                        return res.status(401).json({error: 'Unauthoriized user!'});
                    }
                    else {
                        const role = user.role
                        const token = jwtToken(user.email, user._id, keys.JWT_KEY)
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.status(200).json({
                                message: `Welcome ${user.name} (${user.role})`,
                                role,
                                token
                            })
                        })
                        
                    }
                    
                }
            })

        })
        .catch(err => {
            return res.status(500).json({
                error:err
            })
        })
    }
}

module.exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      return res.status(200).json('Successfully logged out');
    });
};

module.exports.passChange = (req, res, next) => {
  const password = req.body.password
  const newPassword = req.body.newPassword
  User.findOne({email : req.body.email})
    .then(user => {
      if (!user) {
        res.status(201).json({
            message: 'E-Mail not found, please input a valid email address.'
        });
    } else {
        bcrypt.compare( password, user.password, (err, result) => {
            console.log(password, user.password)
            if (!result) {
                return res.status(401).json({
                    message: 'Password does not match that in database.'
                })
            } else if (result) {
                bcrypt.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword
                user.save();
                res.status(201).json({
                    message: 'Password successfully changed'
                })
            })}
        })
    }
    })
}

module.exports.resetPass = (req, res, next) => {
    const email = req.body.email
    const passwordResetUrl = req.body.passwordResetUrl
    User.findOne({ email })
        .exec()
        .then(async user => {
            if (!user) {
                console.log('no user')
                return res.status(401).json({
                    message: 'email not found'
                })
            }
            console.log(email, user._id, "1h", process.env.JWT_KEY)
            const token = jwtToken(email, user._id, process.env.JWT_KEY)
            console.log(token)
            let subject = 'Passord Reset Request'
            let html = sendMailTemplate2(email, passwordResetUrl, token)
            await sendMail(email, subject, html).then(result => console.log('Email sent ...', result))
                        .catch((error) => console.log(error.message))
                    .then(result => {
                        return res.status(201).json({
                          message: `success`
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).send({message: 'error processing request'})
                    });
        })
}

module.exports.newPass = (req, res, next) => {
    const token = req.params.token;
    const decodedtoken = jwt.verify(token, process.env.JWT_KEY)
    console.log(decodedtoken)
    const uemail = decodedtoken.email
    const newPassword = req.body.password
    console.log(uemail)
    User.findOne({email : uemail})
    
        .then(async user => {
            if (!user) {
                res.status(201).json({
                    message: 'Auth Error'
                });  
            } else {
                let newPass = await hashPassword(newPassword)
                console.log(newPass)
                user.password = newPass
                user.save();
                res.status(201).json({
                    message: 'Password successfully reset'
                })
            }
        })
}
