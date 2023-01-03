const Product = require('../models/product');
const Order = require('../models/order');
const { sendMailTemplate3, sendMail } = require('../helpers/sendMail');

module.exports.getProducts = (req, res, next) => {
    Product.find({})
    .then(products => {
        if (products.length > 0){
            return res.status(200).json({
                message: `Meal list read`,
                products
            })
        }
        else {
            return res.send({ message: 'No meals found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.addProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const day = req.body.day;

    if (!title || !imageUrl || !price || !description || !day) {
        res.send({ msg: "Please fill in all fields" })
    }
    else {
        Product.findOne({title})
        .then(async product => {
            if (product) {
                return res.send({ message: 'Meal already in system'})
            }
            else {
                const product = new Product({
                    title,
                    imageUrl,
                    price,
                    description,
                    day
                })
                await product.save()
                .then(prod => {
                    return res.status(200).json({
                        message: `Meal successfully created`,
                        prod
                    })
                })
                .catch(err => {
                    console.log(err)
                    return next(err)
                })
            }
        })
        .catch(err => {
            console.log(err)
            return next(err)
        })
    }
    
}

module.exports.getEditProduct = (req, res, next) => {
    const pId = req.params.productId

    Product.findById(pId)
    .then(product => {
        return res.status(200).json({
            message: `Meal read`,
            product
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.postEditProduct = (req, res, next) => {
    const pId = req.params.productId;
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const day = req.body.day;

    Product.findById(pId)
    .then(product => {
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        product.day = day

        product.save()
        return res.status(200).json({
            message: `Meal updated`,
            product
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.delProduct = (req, res, next) => {
    const pId = req.params.productId

    Product.findByIdAndRemove(pId)
    .then(() => {
        return res.send({ message: 'Meal deleted'})
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.getOrders = (req, res, next) => {
    Order.find({})
    .then(orders => {
        if (orders.length > 0){
            // const bv = orders[0].products[0].quantity
            return res.status(200).json({
                message: `Order list read`,
                orders,
                // bv
            })
        }
        else {
            return res.send({ message: 'No orders found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.delOrder = (req, res, next) => {
    const oId = req.params.orderId

    Order.findByIdAndRemove(oId)
    .then(() => {
        return res.send({ message: 'Order cancelled'})
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.completeOrder = (req, res, next) => {
    const oId = req.params.orderId

    Order.findById(oId)
    .then(async order => {
        order.completed = true;
        await order.save()
        let subject = 'Order Completion'
        let html = sendMailTemplate3(order.user.name, order.products.quantity, order.products.product.title)
        await sendMail(order.user.email, subject, html).then(result => console.log('Email sent ...', result))
        .catch((error) => console.log(error.message))
        .then(result => {
            return res.status(201).json({
              message: `Order successfully completed`,
              result
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400).send({message: 'error completing order'})
    })
}
