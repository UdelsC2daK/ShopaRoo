/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var jwt = require("jsonwebtoken"); 
var bcrypt = require("bcryptjs");
const secretKey = "shoparoowebapitoauthenticateusers";  

module.exports = {

    create: async function (req, res) {
        Log('Attempting to create a new user with email: ' + req.body.email);

        var findCriteria = { email: req.body.email };
        var recordToCreate = { name: req.body.name, email: req.body.email, password: req.body.password };

        User.findOne(findCriteria).exec(function (err, user) {
            if (err) return res.serverError(err);

            if (user) {
                const msg = 'Existing user found with email : ' + user.email;
                Log(msg);
                return res.json(msg);
            }
            else {
                User.create(recordToCreate, async function (err, newuser) {
                    if (err) return res.serverError(err);
                    Log('A new user created with email: ' + req.body.email);
                    // Find the user since newuser on callback is undefined
                    newuser = await User.findOne({ email: req.body.email });
                    return res.json(newuser);
                });
            }
        });
    },

    /**
     * this is used to authenticate user to our api using either email and password
     * POST /login
     * @param req
     * @param res
     */
    login: function (req, res) {

        /**
         * this is param checking if they are provided
         */
        if (!_.has(req.body, 'email') || !_.has(req.body, 'password')) {
            return res.serverError("No field should be empty.");
        }

        /**
         * check if the username matches any email or phoneNumber
         */
        User.findOne({
            email: req.body.email
        }).exec(function callback(err, user) {
            if (err) return res.serverError(err);

            if (!user) return res.serverError("User not found, please sign up.");


            //check password
            bcrypt.compare(req.body.password, user.password, function (error, matched) {
                if (error) return res.serverError(error);

                if (!matched) return res.serverError("Invalid password.");

                //save the date the token was generated for already inside toJSON()
                var token = jwt.sign(user.toJSON(), secretKey, {
                    expiresIn: '5s'
                });

                //return the token here
                res.ok(token); 
            });

        });
    },

    /**
     * This is used to request for another token when the other token is about
     * expiring so for next request call the token can be validated as true
     * GET /token
     * @param req
     * @param res
     */
    token: function (req, res) { 
        User.findOne(req.user.id).exec(function callback(error, user) {
            if (error) return res.serverError(error);
            if (!user) return res.serverError("User not found");

            var token = jwt.sign(user.toJSON(), secretKey, {
                expiresIn: '5s'
            });
            res.ok(token);
        });
    }
};

/**
 * Global function for console log
 */
function Log(msg) {
    sails.log(msg);
}

