"use strict";

var express = require('express');

var router = express.Router();

var user = require('../model/users');

var auth = require('../middleware/auth');

var sharp = require('sharp');

var multer = require('multer');

var _require = require('../email/account'),
    sendWelcomeMail = _require.sendWelcomeMail,
    sendCancelMail = _require.sendCancelMail; //using multer for uploading files


var upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter: function fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error(req.t('invalid_upload')));
    }

    cb(undefined, true);
  }
}); //creating new user

router.post('/user', function _callee(req, res) {
  var newUser, token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newUser = new user(req.body);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(newUser.save());

        case 4:
          sendWelcomeMail(newUser.email, newUser.name);
          _context.next = 7;
          return regeneratorRuntime.awrap(newUser.generateAuthToken());

        case 7:
          token = _context.sent;
          res.status(201).send({
            newUser: newUser,
            token: token,
            message: req.t('user_create_success')
          });
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          res.status(400).send(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); //creating new avatar, for user

router.post("/user/me/avatar", auth, upload.single('avatar'), function _callee2(req, res) {
  var buffer;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize({
            width: 250,
            height: 250
          }).png().toBuffer());

        case 2:
          buffer = _context2.sent;
          req.user.avatar = buffer;
          _context2.next = 6;
          return regeneratorRuntime.awrap(req.user.save());

        case 6:
          res.status(200).send();

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}, function (error, req, res, next) {
  res.status(400).send({
    error: error.message
  });
}); //deleting avatar for user

router["delete"]("/user/me/avatar", auth, upload.single('avatar'), function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          req.user.avatar = undefined;
          _context3.next = 3;
          return regeneratorRuntime.awrap(req.user.save());

        case 3:
          res.status(200).send();

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}, function (error, req, res, next) {
  res.status(400).send({
    error: error.message
  });
}); //getting details of logged in user

router.get('/user/me', auth, function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          res.send(req.user);

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}); //

router.get('/user', auth, function _callee5(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(user.find({}));

        case 3:
          users = _context5.sent;
          res.status(200).send(users);
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).send();

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //fetching profile pic of user

router.get('/user/pic/:id', function _callee6(req, res) {
  var userOne;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(user.findById(req.params.id));

        case 3:
          userOne = _context6.sent;

          if (!(!userOne || !userOne.avatar)) {
            _context6.next = 6;
            break;
          }

          throw new Error("");

        case 6:
          res.set('Content-Type', 'image/png');
          res.send(userOne.avatar);
          _context6.next = 13;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          res.status(500).send(_context6.t0);

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); //login route for user

router.post('/user/login', function _callee7(req, res) {
  var userOne, token;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(user.findByCredentials(req.body.email, req.body.password));

        case 3:
          userOne = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(userOne.generateAuthToken());

        case 6:
          token = _context7.sent;
          res.status(201).send({
            userOne: userOne,
            token: token
          });
          _context7.next = 13;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          res.status(400).send();

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); //logout user

router.post('/user/logout', auth, function _callee8(req, res) {
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          req.user.tokens = req.user.tokens.filter(function (token) {
            return token.token !== req.token;
          });
          _context8.next = 4;
          return regeneratorRuntime.awrap(req.user.save());

        case 4:
          console.log(req.token);
          res.status(200).send(req.t('logged_out'));
          _context8.next = 11;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          res.status(500).send();

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); //logout from all the devices 

router.post('/user/logoutall', auth, function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          req.user.tokens = req.user.tokens.filter(function (token) {
            return token.token === "";
          });
          _context9.next = 4;
          return regeneratorRuntime.awrap(req.user.save());

        case 4:
          console.log(req.token);
          res.status(200).send('Logged Out!!');
          _context9.next = 11;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          res.status(500).send();

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); //updating user details

router.patch('/user/me', auth, function _callee10(req, res) {
  var updates, allowedUpdates, isValidOperation;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          updates = Object.keys(req.body);
          allowedUpdates = ['name', 'email', 'password', 'age'];
          isValidOperation = updates.every(function (update) {
            return allowedUpdates.includes(update);
          });

          if (isValidOperation) {
            _context10.next = 5;
            break;
          }

          return _context10.abrupt("return", res.status(500).send({
            error: req.t('invalid_updates')
          }));

        case 5:
          _context10.prev = 5;
          updates.forEach(function (update) {
            return req.user[update] = req.body[update];
          });
          _context10.next = 9;
          return regeneratorRuntime.awrap(req.user.save());

        case 9:
          res.status(200).send(req.user);
          _context10.next = 15;
          break;

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](5);
          res.status(400).send(_context10.t0);

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[5, 12]]);
}); //deleting profile of user

router["delete"]('/user/me', auth, function _callee11(req, res) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(req.user.remove());

        case 3:
          sendCancelMail(req.user.email, req.user.name);
          res.status(201).send({
            message: req.t('profile_deleted')
          });
          _context11.next = 10;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          res.status(500).send({
            message: req.t('profile_not_exist')
          });

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;