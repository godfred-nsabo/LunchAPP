const router = require('express').Router();
const { index, products, product } = require('../controllers/home');

router.get('/', index);

router.get('/products', products);

router.get('/products/:productId', product);

module.exports = router;
