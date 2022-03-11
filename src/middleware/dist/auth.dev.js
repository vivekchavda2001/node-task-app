"use strict";

var jwt = require('jsonwebtoken');

var User = require('../model/users'); //Authentication for token validation


var auth = function auth(req, res, next) {
  var token, decoded, user;
  return regeneratorRuntime.async(function auth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.header('Authorization').replace('Bearer ', '');
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            _id: decoded._id,
            'tokens.token': token
          }));

        case 5:
          user = _context.sent;

          if (user) {
            _context.next = 8;
            break;
          }

          throw new Error();

        case 8:
          req.user = user;
          req.token = token; // console.log(req.user);

          next();
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          res.status(401).send({
            error: 'Please authenticate.'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = auth;