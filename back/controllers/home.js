const Product = require('../models/product')

module.exports.index = (req, res, next) => {
    return res.send('Welcome to the Amali-eats homepage!')
}

module.exports.products = (req, res, next) => {
    Product.find({})
    .then(products => {
        if (products.length > 0){
            return res.status(200).json({
                message: `Product list read`,
                products
            })
        }
        else {
            return res.send({ message: 'No products found'})
        }
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}

module.exports.product = (req, res, next) => {
    const pId = req.params.productId

    Product.findById(pId)
    .then(product => {
        return res.status(200).json({
            message: `Product read`,
            product
        })
    })
    .catch(err => {
        console.log(err)
        return next(err)
    })
}
