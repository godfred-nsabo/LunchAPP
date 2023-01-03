const router = require('express').Router();
const { getCart, postCart, cartDelete, order, today, coupon} = require('../controllers/shop');

router.get('/cart/:userId', getCart);

router.post('/cart/:userId/:productId', postCart);

router.post('/del/:userId/:productId', cartDelete);

router.post('/order/:userId', order);

router.get('/today', today);

router.post("/coupon", coupon);

// router.get('/checkout', checkout);

module.exports = router;
