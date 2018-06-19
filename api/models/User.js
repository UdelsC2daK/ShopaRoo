/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

var bcrypt = require("bcryptjs");

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    roles: {
      type: 'string',
      isIn: ['DEFAULT_USER'],
      defaultsTo: "DEFAULT_USER"
    },
    email: {
      type: 'string',
      unique: true,
      isEmail: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },

  },

  customToJSON: function () {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['password'])
  },
  /**
   * this holds our validation message by
   * sails-hook-validation dependency
   */
  validationMessages: { //hand for i18n & l10n
    name: {
      required: 'Name is required'
    },
    email: {
      email: 'Provide valid email address',
      required: 'Email is required',
      unique: 'This email is already existing'
    },
    password: {
      required: 'Password is required'
    }
  },

  /**
   * this is called so we can create our password hash for us
   *
   * before saving
   * @param values
   * @param cb
  */
  beforeCreate: function (user, next) {
    if (user.password) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            console.log(err);
            next(err)
          } else {
            user.password = hash;
            next();
          }
        });
      });
    }
  } 
 };
