const {hashPassword} = require('../helpers/hashPassword')
const { sendMail, sendMailTemplate1, sendMailTemplate5} = require('../helpers/sendMail')

const Coupon = require('../models/coupon');
const User = require('../models/user');

module.exports.getManager = (req, res, next) => {
    User.find({role : 'manager'})
    .then(managers => {
        if (managers.length > 0){
            return res.status(200).json({
                message: `Manager list read`,
                managers
            })
        }
        else {
            return res.send({ message: 'No managers found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.getCrew = (req, res, next) => {
    User.find({})
    .then(user => {
        let adminCounter = 0;
        let staffCounter = 0;
        let traineeCounter = 0;
        let managerCounter = 0;
        const users = user.length

        for (let person of user) {
        if (person.role === "admin") {
          adminCounter++;
        } else if (person.role === "manager") {
          managerCounter++;
        } else if (person.role === "staff") {
          staffCounter++;
        } else {
          traineeCounter++;
        }
      }
      return res.status(200).json({
        message: `User breakdown list read`,
        adminCounter,
        managerCounter,
        staffCounter,
        traineeCounter,
        users,
        // user
    })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.getAdmin = (req, res, next) => {
    User.find({role : 'admin'})
    .then(admins => {
        if (admins.length > 0){
            return res.status(200).json({
                message: `Admin list read`,
                admins
            })
        }
        else {
            return res.send({ message: 'No admins found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.getStaff = (req, res, next) => {
    User.find({role : 'staff'})
    .then(staff => {
        if (staff.length > 0){
            return res.status(200).json({
                message: `Staff list read`,
                staff
            })
        }
        else {
            return res.send({ message: 'No staff found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.getTrainee = (req, res, next) => {
    User.find({role : 'trainee'})
    .then(trainees => {
        if (trainees.length > 0){
            return res.status(200).json({
                message: `Trainee list read`,
                trainees
            })
        }
        else {
            return res.send({ message: 'No trainees found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.getUsers = (req, res, next) => {
    User.find({})
    .then(users => {
        if (users.length > 0){
            return res.status(200).json({
                message: `User list read`,
                users
            })
        }
        else {
            return res.send({ message: 'No users found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.delUser = (req, res, next) => {
    const uId = req.params.userId

    User.findById(uId).deleteOne()
    .then(user => {
        return res.status(200).json({
            message: `User deleted`,
            user
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.approveUser = (req, res, next) => {
    const uId = req.params.userId

    User.findById(uId)
    .then(async user => {
        user.disabled = false;
        await user.save()
        let subject = 'Account Validated'
        let html = sendMailTemplate5(user.name)
        await sendMail(user.email, subject, html).then(result => console.log('Email sent ...', result))
        .catch((error) => console.log(error.message))
        return res.status(200).json({
            message: `User approved`,
            user
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.getEditUser = (req, res, next) => {
    const uId = req.params.userId

    User.findById(uId)
    .then(user => {
        return res.status(200).json({
            message: `User read`,
            user
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.postEditUser = (req, res, next) => {
    const uId = req.params.userId;
    const name = req.body.name;
    const email = req.body.email;
    // const password = req.body.password;
    const role = req.body.role;
    // const disabled = req.body.disabled;

    User.findById(uId)
    .then(user => {
        user.name = name;
        user.email = email;
        user.password = user.password;
        user.role = role;
        user.disabled = user.disabled;

        user.save()
        return res.status(200).json({
            message: `User updated`,
            user
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.postNewUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const role = req.body.role;

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
                    disabled: false,
                    cart: { items: [] }
                });
                user.save()
                let subject = 'Welcome to Amali-eats'
                let html = sendMailTemplate1(name)
                  await sendMail(email, subject, html).then(result => console.log('Email sent ...', result))
                    .catch((error) => console.log(error.message))
                .then(result => {
                    return res.status(201).json({
                      message: `User successfully created`,
                      post: { id: new Date().toISOString() }
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({message: 'error creating user'})
        })
    }
}

module.exports.getCoupons = (req, res, next) => {
    Coupon.find({})
    .then(coupons => {
        if (coupons.length > 0){
            return res.status(200).json({
                message: `Coupon list read`,
                coupons
            })
        }
        else {
            return res.send({ message: 'No coupons found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.addCoupon = (req, res, next) => {
    const code = req.body.code;

    if  (!code) {
        res.send({msg: "Please enter a code"})
    }
    else if (code.length < 8 || code.length > 8) {
        res.send({msg: "Please enter 8 characters" })
    }
    else {
        Coupon.findOne({code}).exec((error, coupon) => {
            if (coupon) {
                res.send({ msg: "Coupon code already exists"})
            }

            else{
                const coupon = new Coupon({
                    code,
                    date: new Date(),
                    redeemed: 0
                })
                coupon.save()
                .then((result) => {
                    res.send("Coupon added Succesfully");
                    
                })
                .catch(err => {
                    console.log(err)
                    return next(err)
                })
            }
    
        })
    }
}

module.exports.genCoupon = (req, res, next) => {
    var code = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
        const coupon = new Coupon({
            code: code,
            date: new Date(),
            redeemed: 0
        })
    coupon.save()
    .then((value) => {
        console.log(code);
        return res.send({msg: "Coupon added successfully", code})
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.delCoupon = (req, res, next) => {
    const cId = req.params.couponId

    Coupon.findById(cId).deleteOne()
    .then(coupon => {
        return res.status(200).json({
            message: `Coupon deleted`,
            coupon
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.delExpired = (req, res, next) => {
    Coupon.deleteMany({status: 'Expired'})
    .then(result => {
        return res.send({message: 'Deleted', result})
    })
    .catch(err => {
        return next(err)
    })
}

