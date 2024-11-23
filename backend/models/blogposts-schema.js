const mongoose = require('mongoose')

// blogpost schema: id, title, author, dateStamp, category,
//                  body, image, likes, usersLikes
const blogpostsSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true,
    },
    postTitle: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
        index: true,
    },
    dateStamp: {
        type: Date,
        default: Date.now,
    },
    category: {
        // e.g. gastro, ortho, cardio, etc. (filter purposes?)
        type: String,
        required: true,
    },
    postBody: {
        type: String,
        required: false,
    },
    image: {
        type: Buffer,
        required: false,
    },
    imageMimeType: {
        type: String,
        required: false,
    },
    likes: {
        type: Number,
        default: 0,
    },
    usersLikes: {
        type: [String],
        default: [],
    },
})

module.exports = mongoose.model('Blogposts', blogpostsSchema)