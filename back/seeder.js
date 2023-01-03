const {hashPassword} = require('./helpers/hashPassword')
const keys = require('./config/keys')
const mongoose = require('mongoose');
const User = require("./models/user");

mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb')
})

const importData = async() => {
    const pass = 'arashi09'
    const user = new User({
        name: "Arashi",
        email: "arashi@arashi.com",
        password: await hashPassword(pass),
        role: "admin",
        created_at: new Date(),
        disabled: false,
        cart: { items: []}
    })
    user.save()
    .then(result => {
        console.log(result);
        process.exit(0);
    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })
}

importData();
