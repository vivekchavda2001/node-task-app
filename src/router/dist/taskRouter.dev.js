"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var Task = require('../model/tasks');

var auth = require('../middleware/auth'); //route for addind task along with user id


router.post('/task', auth, function _callee(req, res) {
  var newTask;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newTask = new Task(_objectSpread({}, req.body, {
            owner: req.user._id
          }));
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(newTask.save());

        case 4:
          res.status(200).send(newTask);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          res.status(400).send(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
}); //route for getting task for logged in user

router.get('/task', auth, function _callee2(req, res) {
  var match, sort, parts;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          match = {};
          sort = {};

          if (req.query.completed) {
            match.completed = req.query.completed === true;
          }

          if (req.query.sortBy) {
            parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
          }

          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(req.user.populate({
            path: 'tasks',
            match: match,
            options: {
              limit: parseInt(req.query.limit),
              skip: parseInt(req.query.skip)
            },
            sort: sort
          }).execPopulate());

        case 7:
          res.status(200).send(req.user.tasks);
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](4);
          res.status(500).send(_context2.t0);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 10]]);
}); //getting specific task

router.get('/task/:id', auth, function _callee3(req, res) {
  var task;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Task.find({
            _id: req.params.id,
            owner: req.user._id
          }));

        case 3:
          task = _context3.sent;

          if (task) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).send());

        case 6:
          res.status(200).send(task);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(404).send();

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); //updating task

router.patch('/task/:id', auth, function _callee4(req, res) {
  var updates, allowedUpdates, isValidOperation, taskOne;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          updates = Object.keys(req.body);
          allowedUpdates = ['description', 'completed'];
          isValidOperation = updates.every(function (update) {
            return allowedUpdates.includes(update);
          });

          if (isValidOperation) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).send({
            error: req.t('invalid_updates')
          }));

        case 5:
          _context4.prev = 5;
          _context4.next = 8;
          return regeneratorRuntime.awrap(Task.findOne({
            _id: req.params.id,
            owner: req.user.id
          }));

        case 8:
          taskOne = _context4.sent;

          if (taskOne) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(404).send());

        case 11:
          updates.forEach(function (update) {
            return taskOne[update] = req.body[update];
          });
          _context4.next = 14;
          return regeneratorRuntime.awrap(taskOne.save());

        case 14:
          res.status(200).send(taskOne);
          _context4.next = 20;
          break;

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](5);
          res.status(500).send();

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 17]]);
}); //deleting task

router["delete"]('/task/:id', auth, function _callee5(req, res) {
  var taskOne;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
          }));

        case 3:
          taskOne = _context5.sent;

          if (taskOne) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).send());

        case 6:
          res.status(200).send(taskOne);
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(500).send();

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;