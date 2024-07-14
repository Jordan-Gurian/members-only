require('dotenv').config()
const User = require('../models/user');

const asyncHandler = require("express-async-handler");
const { body, validationResult, Result } = require("express-validator");
const passport = require('passport');

const genPassword = require('../lib/passwordUtils').genPassword;

// Get sign up form
exports.user_create_get = asyncHandler(async (req, res, next) => {
    // Get all sign up form
    res.render("sign-up", {
      title: "Sign-Up Form",
    });
});

exports.user_create_post = [
    // Validate and sanitize fields.
    body("firstname", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("lastname", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("username", "Username must not be empty and must be email.")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .escape(),
    body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .custom(async (value, {req, loc, path}) => {
        if (req.body.confirmpassword !== value) {            
            throw new Error('passwords do not match')
        }
    })
    .escape(),
    
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            
            res.send({ errors: errors.array() }); 
            // There are errors. Render form again with sanitized values/errors messages.
          // Error messages can be returned in an array using `errors.array()`.
        } else {

            const hash = await genPassword(req.body.password);
            const newUser = new User({
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                username: req.body.username,
                password: hash,
            });

            await newUser.save();

            res.redirect('/');
        };
    })
];

exports.user_read_get = (req, res, next) => {
    // Get log in form
    res.render("log-in", {
      title: "Log in",
    });
};

exports.user_read_post = (req, res, next) => {
    return passport.authenticate('local', { failureRedirect: '/log-in', successRedirect: '/' });
};

exports.user_update_get = (req, res, next) => {
    // Get log in form
    res.render("join", {
      title: "Join the club!",
    });
};

exports.user_update_post = async(req, res, next) => {
    if (req.body.secret === process.env.SECRET) {
        await User.findOneAndUpdate({ _id: req.user._id }, { member_status: true });
        res.redirect('/');
    } else {
        return res.send('WRONG!');
    }
};