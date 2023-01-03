const bcrypt = require('bcryptjs');
const keys = require('../config/keys');

module.exports.hashPassword = async (password) => {
    return bcrypt.hash(password, 12)
}