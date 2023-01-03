const router = require('express').Router();
const { getManager, getAdmin, getCrew, getStaff, getTrainee, getUsers, delUser, approveUser, getEditUser, postEditUser, postNewUser, getCoupons, addCoupon, genCoupon, delCoupon, delExpired } = require('../controllers/admin');


router.get('/manager', getManager);

router.get('/admin', getAdmin);

router.get('/crew', getCrew);

router.get('/staff', getStaff);

router.get('/trainee', getTrainee);

router.get('/users', getUsers);

router.post('/del-user/:userId', delUser);

router.get('/approve/:userId', approveUser);

router.get('/edit-user/:userId', getEditUser);

router.post('/edit-user/:userId', postEditUser);

router.post('/new-user', postNewUser);

router.get("/coupons", getCoupons);

router.post("/addcoupon", addCoupon);

router.post("/gencoupon", genCoupon);

router.post('/del-coupon/:couponId', delCoupon);

router.post('/delexpired', delExpired);

module.exports = router;