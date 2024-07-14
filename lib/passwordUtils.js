const bcrypt = require("bcryptjs");

async function genPassword(password) {
    return await bcrypt.hash(password, 10)
}

async function validPassword(password, hash, done) {
    const match = await bcrypt.compare(password, hash);
    return match
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;