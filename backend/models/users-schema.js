const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// user schema: id, username, email, password, role
const usersSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String,
        // e.g. '1', '2', '3'
    },
    username: {
        required: true,
        unique: true,
        type: String,
        // e.g. 'Luna', 'Howard'
    },
    email: {
        required: true,
        unique: true,
        type: String,
        // e.g. 'luna@gmail.com'
    },
    password: {
        required: true,
        type: String,
        // e.g. 'password123'
    },
    role: {
        required: true,
        type: String,
        // e.g. 'admin', 'user'
    }
})

module.exports = mongoose.model('Users', usersSchema)