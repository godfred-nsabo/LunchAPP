const { sendMail, sendMailTemplate4} = require('../helpers/sendMail')

const Product = require('../models/product');
const Order = require('../models/order');
const Coupon = require('../models/coupon');
const User = require('../models/user');

module.exports.getCart = (req, res, next) => {
    const uId = req.params.userId

    User.findById(uId)
    .then(user => {
        const meals = user.cart.items
        if (meals.length > 0) {
            return res.status(200).json({
                message: `User cart read`,
                meals
            })
        }
        else {
            return res.send({ message: 'Cart empty. Please select a meal'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.postCart = (req, res, next) => {
    const pId = req.params.productId;
    const uId = req.params.userId;

    Product.findById(pId)
    .then(product => {
        User.findById(uId)
        .then(async user => {
            await user.addToCart(product)
        })
        .then(result => {
            return res.send('Meal added to cart')
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.cartDelete = (req, res, next) => {
    const pId = req.params.productId;
    const uId = req.params.userId;

    Product.findById(pId)
    .then(product => {
        User.findById(uId)
        .then(async user => {
            await user.removeFromCart(pId)
        })
        .then(result => {
            return res.send('Meal removed from cart')
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.order = (req, res, next) => {
    const uId = req.params.userId;

    User.findById(uId)
    .then(async user => {
        const meals = user.cart.items.map(i => {
            return { quantity: i.quantity, productId: i.productId, product: i.product  };
        });
        if (meals.length > 0) {
            const order = new Order({
                user: {
                    email: user.email,
                    name: user.name,
                    userId: uId
                },
                products: meals
            })
            await order.save()
            let subject = 'Order Placed'
            let html = sendMailTemplate4(user.name, meals[0].quantity, meals[0].product)
            await sendMail(user.email, subject, html).then(result => console.log('Email sent ...', result))
            .catch((error) => console.log(error.message))
            .then(async() => {
                await user.clearCart();
                return res.send('Order placed')
            })
        }
        else {
            return res.send({ message: 'Cart empty. Please select a meal'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.today = (req, res, next) => {
    var date = new Date();
    var days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    var day = days[date.getDay()];
    var meals = []

    Product.find({})
    .then(products => {
        for (var prod = 0; prod < products.length; prod++) {
            console.log(products[prod].day)
            if (products[prod].day === day){
                meals.push(products[prod])
            }
            else {
                next()
                // return res.send({meals: `No Meals found for ${day}`})
            }
        }
        if (meals.length > 0){
            return res.send({ meals: meals})
        }
        else {
            return res.send({ meals: 'No Meals found'})
        }
    })
    .catch(err => {
        return next(err)
    })
}

module.exports.coupon = (req, res, next) => {
    const coupon = req.body.coupon

    Coupon.findOne({ code: coupon })
    .then(async coupon => {
        if (!coupon){
            return res.send({message: 'Invalid Coupon', status: 'fail'})
        }
        if (coupon.redeemed >= 5){
            coupon.status = 'Expired'
            await coupon.save()
            /// Add delete code
            return res.send({message: 'Invalid Coupon (expired)', status: 'fail'})
        }
        else {
            coupon.redeemed +=1
            await coupon.save()
            return res.send({message: 'Coupon validated', status: 'success'})
        }
    })
    .catch(err => {
        return next(err)
    })
}
