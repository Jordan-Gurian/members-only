const Message = require('../models/message');
const User = require('../models/user');

const asyncHandler = require("express-async-handler");
const { body, validationResult, Result } = require("express-validator");
const passport = require('passport');

//Get list of all messages
exports.message_list = asyncHandler(async (req, res, next) => {
    const allMessages = await Message.find()
    .sort({ timestamp: -1 })
    .populate("user")
    .exec();

    // const userArray = allMessages.map((id) => User.find())

    res.render('index', { user: req.user, allMessages: allMessages });
})

// Get message form
exports.message_create_get = asyncHandler(async (req, res, next) => {
    // Get all sign up form
    res.render("message", {
      title: "Create Message",
    });
});

exports.message_create_post = [
    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("body", "Message body must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            
            res.send({ errors: errors.array() }); 
            // There are errors. Render form again with sanitized values/errors messages.
          // Error messages can be returned in an array using `errors.array()`.
        } else {
            const user = await req.user;
            const newMessage = new Message({
                title: req.body.title,
                body: req.body.body,
                user: user,
                timestamp: Date.now(),
            });

            await newMessage.save();

            res.redirect('/');
        };
    })
];
