"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const Buyer = require('../models/buyer');
const Owner = require('../models/owner');
const {secret} = require('./config');

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
  };
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, callback) {
      if(jwt_payload.userType === 'buyer'){
        console.log("Inside buyer = ");
        Buyer.findOne({_id:jwt_payload.id})
        .then(buyer => {
          console.log(" buyer = ", buyer);
          callback(null, buyer);
        })
        .catch(err => callback(err,false))
      } else {
        Owner.findOne({id:jwt_payload.id})
        .then(owner => callback(null, owner))
        .catch(err => callback(err,false))
      }
    },function(err) {
          return callback(err, false);
        }
      )
    );
  }