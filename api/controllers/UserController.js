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


  create: async function (req, res, next, cb) {
    var groupToCreate = {
        userId: 1,
        groupId: '1',
        groupName: 'testg'
      };
      
      
    var newGroup = await Group.create(groupToCreate).fetch();
    return res.json(newGroup);



    Log('Attempting to create a new user with UserId: ' + req.body.userId);

    var findCriteria = {
      userId: req.body.userId
    };
    var recordToCreate = {
      userId: req.body.userId,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone
    };



    User.findOne(findCriteria).exec(function (err, user) {
      if (err) return res.serverError(err);

      if (user) {
        const msg = 'Existing user found with UserId : ' + user.userId;
        Log(msg);
        return res.json(user);
      } else {

        User.create(recordToCreate, async function (err, newUser) {
          if (err) return res.serverError(err);
          Log('A new user created with UserId: ' + req.body.userId);

          // Find the user since newuser on callback is undefined
          newUser = await User.findOne(
            findCriteria
          ).exec(async function (err, newUser) {
            if (err) return res.serverError(err);
            var groupToCreate = {
              userId: newUser.id,
              groupId: '1',
              groupName: 'mygroup',
              owner: newUser.id
            };

            Group.create(groupToCreate, function (err, newGroup, test) {
              if (err) return res.serverError(err);

              User.addToCollection(newUser.id, 'groups').members([newGroup.id]);

              return res.json(newUser);
            });
          });
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
        expiresIn: '5m'
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
