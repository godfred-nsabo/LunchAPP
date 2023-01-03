const router = require('express').Router();
const { getLogin, getSignup, postLogin, postSignup, postLogout, passChange, resetPass, newPass } = require('../controllers/auth');

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.post('/login', postLogin);

router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.post('/passchange', passChange)

router.post('/resetpass', resetPass);

router.post('/newpass/:token', newPass);

module.exports = router;