const User = require('../models/user');
const UserController = require('../controller/usercontroller');
const ResponseController = require('../controller/ResponseController');
const jwt = require('jsonwebtoken');
const { error } = require('../controller/ResponseController');

class Auth {
    async authenticate(req, res, next) {
        try {
            if ('authorization' in req.headers && req.headers.authorization != null) {
                var token = req.headers.authorization;
                console.log("token===>", token)
                var decodedData = jwt.verify(token, 'secretkey');
                if (decodedData.iat < decodedData.exp) {
                    next();
                }
            } else {
                throw new Error('Authorization token is missing');
            }
        } catch (error) {
            console.log('AUTH ERROR')
            return ResponseController.error(error, res);
        }
    }

}
module.exports = new Auth;