const mongoose = require('mongoose')

// comments schema: commentId, postId, commenterId, dateStamp,
//                  commentBody, likes, usersLikes
const commentsSchema = new mongoose.Schema({
  commentId: {
    type: String,
    required: true,
    unique: true,
  },
  postId: {
    type: String,
    required: true,
    unique: true,
  },
  commenterId: {
    type: String,
    required: true,
  },
  dateStamp: {
    type: Date,
    default: Date.now,
  },
  commentBody: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Comments', commentsSchema)
