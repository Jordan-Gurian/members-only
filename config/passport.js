const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

const verifyCallback = async (username, password, done) => {

    try {
        const user = await User.findOne({ username: username })

        if (!user) { return done(null, false) }

        const isValid = await validPassword(password, user.password, done);

        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Incorrect password" });
        }
    } catch (err) {
        done(err);
    }
};

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);
        done(null, user);
    } catch(err) {
        done(err);
    };
});
