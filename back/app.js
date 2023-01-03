const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');
const keys = require('./config/keys')
// const morgan = require('morgan')
const port = process.env.port || 6000

const checkAuth = require('./midleware/check-auth')

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');
const shopRoutes = require('./routes/shop');
const homeRoutes = require('./routes/home')

const app = express();
// const store = new MongoDBStore({
//   uri: process.env.keys_mongodb_dbURI,
//   collection: 'sessions'
// });

mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('connected to mongodb')
})

app.use('/static', express.static(path.join(__dirname, 'templates')))

app.use(flash());

app.use(bodyParser.json()); // application/json

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    // store: store
  })
);

app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/auth', authRoutes);
app.use('/admin', checkAuth, adminRoutes);
app.use('/manager', checkAuth, managerRoutes);
app.use('/shop', checkAuth, shopRoutes);
app.use('/home', homeRoutes);

app.listen(port)


//handle errors
app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

//handle all kinds of errors -opearations on database
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})
