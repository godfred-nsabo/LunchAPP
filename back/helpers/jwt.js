const jwt = require('jsonwebtoken')

module.exports.jwtToken = (email, userId, key) => {
    return jwt.sign(
        {
        email,
        userId
        },
        key,
        {
            expiresIn : "4h"
        }
    )
}