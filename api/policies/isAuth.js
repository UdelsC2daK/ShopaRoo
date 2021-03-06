/**
 * Created by udles on 13/05/2018.
 */
var jwt = require("jsonwebtoken");
const secretKey = "shoparoowebapitoauthenticateusers";

module.exports = function (req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];

    if (bearer[0] !== "Bearer") {
      return res.forbidden("bearer not understood");
    }


    //verify if this token was from us or not
    jwt.verify(bearerToken, secretKey, function (err, decoded) {
      if (err) {
        sails.log("Error type of ["+ err.name + "] occured.");
        if (err.name === "TokenExpiredError")
          return res.forbidden("Session expired at "+err.expiredAt+", please login again");
        else
          return res.forbidden("Error authenticating, please login again");
      }


      User.findOne(decoded.id).exec(function callback(error, user) {
        if (error) return res.serverError(err);

        if (!user) return res.serverError("User not found");

        req.user = user;
        next();
      });

    });

  } else {
    return res.forbidden("No token provided");
  }
};