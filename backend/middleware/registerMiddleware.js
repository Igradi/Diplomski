const bcrypt = require('bcrypt');

const hashPassword = async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
};

const matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = { hashPassword, matchPassword };
