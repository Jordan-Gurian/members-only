const bcrypt = require("bcryptjs");

async function genPassword(password) {
    return await bcrypt.hash(password, 10)
}

async function validPassword(password, hash) {
    const match = await bcrypt.compare(password, hash);

    if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
    }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;