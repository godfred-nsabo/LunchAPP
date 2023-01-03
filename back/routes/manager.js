const router = require('express').Router();
const { getProducts, addProduct, getEditProduct, postEditProduct, delProduct, getOrders, delOrder, completeOrder } = require('../controllers/manager');


router.get('/products', getProducts);

router.post('/add-product', addProduct);

router.get('/edit-product/:productId', getEditProduct);

router.post('/edit-product/:productId', postEditProduct);

router.post('/delete-product/:productId', delProduct);

router.get('/orders', getOrders);

router.post('/del-order/:orderId', delOrder);

router.post('/complete-order/:orderId', completeOrder)

module.exports = router;
