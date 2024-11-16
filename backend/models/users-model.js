const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const usersSchema = require('./users-schema.js')

// schema: id, username, email, password, role
const matchEmail = async (emailEntered) => {
const Users = mongoose.model('Users', usersSchema)
    return Users.findOne({email: emailEntered});
}

const matchPassword = async (passwordEntered) => {
    return await bcrypt.compare(passwordEntered, userPassword)
}

// match credentials (email + password) entered with database records
const matchCredentials = async (emailEntered, passwordEntered) => {
    const user = await matchEmail(emailEntered)
    if (user && await matchPassword(passwordEntered, user.password)) {
        return user;
    }

    // incorrect password or no user found
    return null;
}

// logout = clear session
const logout = (request) => {
    request.session = null
}

const getUser = async (request) => {

    if (request.session && request.session.token) {
        try {
            const token = jwt.verify(request.session.token, process.env.JWT_SECRET)
            const user = await Users.findOne({email: token.email})
            return user
        } catch (e) {
            console.log('getUser error', e)
            return null
        }
    }

    return null
}

module.exports = {
    getUser,
    matchCredentials,
    logout,
}
