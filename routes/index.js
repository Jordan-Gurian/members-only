var express = require('express');
var router = express.Router();
const passport = require('passport');

// Require controller modules.
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

// Get sign up page
router.get('/sign-up', user_controller.user_create_get);

// Get log in page
router.get('/log-in', user_controller.user_read_get);

// Get message page
router.get('/message', message_controller.message_create_get);

// Create user from sign up form data (if valid)
router.post('/sign-up', user_controller.user_create_post);

// Run authetication for login
router.post('/log-in', passport.authenticate('local', { failureRedirect: '/log-in', successRedirect: '/' }));

// Post message to board
router.post('/message', message_controller.message_create_post);

module.exports = router;
