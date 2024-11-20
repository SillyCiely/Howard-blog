const Comment = require('../models/comments-schema')
const { Users } = require('../models/users-schema')
const commentsTestData = require('../models/test-data/comments-testdata')
var { generateID } = require('../models/users-model')
const Post = require("../models/blogposts-schema");

const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findOne({ commentId: req.params.commentId })

        if (comment) {
            const commenter = await Users.findOne({ userId: comment.commenterId })
            const commenterName = commenter.username
            res.json({ comment: comment, commenter: commenterName })
        } else {
            res.status(404).send('Comment not found')
        }
    } catch (error) {
        console.error('Error fetching comment: ', error)
        res.status(500).send('Error fetching comment')
    }
}

const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })

        if (comments.length > 0) {
            res.json(comments)
        } else {
            res.status(404).send('This post does not have any comments yet. Add one!')
        }
    } catch (error) {
        console.error('Error fetching comments: ', error)
        res.status(500).send('Error fetching comments')
    }
}

const getCommentsByUserId = async (req, res) => {
    try {
        const userComments = await Comment.find({ userId: req.params.userId })
        res.json(userComments)
    } catch (error) {
        console.error('Error fetching user comments: ', error)
        res.status(500).send('Error fetching user comments')
    }
}

const createComment = async (req, res) => {
    try {
        const newComment = await Comment.create({
            commentId: generateID(),
            postID: req.body.postId,
            commenterId: req.user.userId,
            commentBody: req.body.commentBody,
            // comments do not support images
            // todo: potential for image attachments?
            //  needs schema update...
            // image: req.file.buffer,
            // imageMimeType: req.file.mimetype,
            likes: 0,
            usersLikes: [],
        })
        res.status(201).json(newComment)
    } catch (error) {
        console.error('Error creating comment: ', error)
        res.status(500).send('Error creating comment')
    }
}

const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({ commentID })

        if (!comment) {
            return res.status(404).send('Comment not found')
        }

        if (comment.commenterId === req.user.id) {
            await Comment.updateOne({ commentId: req.params.commentId }, { $set: { body: req.body.body } })
            res.status(200).send('Comment updated successfully')
        } else {
            return res.status(403).send('Unauthorized')
        }
    } catch (error) {
        console.error('Error updating comment: ', error)
        res.status(500).send('Error updating comment')
    }
}

const likeComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({commentId: req.params.commentId})
        if (!comment.userLikes.includes(req.user.userId)) {
            comment.likes += 1
            comment.usersLikes.push(req.user.userId)
            await comment.save()
            res.status(200).send('Comment liked')
        } else {
            res.status(403).send('Already liked')
        }
    } catch (error) {
        console.error('Error liking comment: ', error)
        res.status(500).send('Error')
    }
}

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({ commentId: req.params.commentId })

        if (!comment) {
            return res.status(404).send('Comment not found')
        }

        if (comment.commenterId === req.user.userId) {
            await Comment.deleteOne({ commentId: req.params.commentId })
            res.status(200).send('Comment deleted successfully')
        } else {
            res.status(403).send('Unauthorized')
        }
    } catch (error) {
        console.error('Error deleting comment', error)
        res.status(500).send('Error')
    }
}

const populateTestData = async (req, res) => {
    try {
        await Comment.create(commentsTestData)
        console.log('/populate complete')
        res.redirect('/')
    } catch (error) {
        console.error(error)
        res.status(500).send('Error')
    }
}

module.exports = {
    getCommentById,
    getCommentsByPostId,
    getCommentsByUserId,
    createComment,
    updateComment,
    deleteComment,
    populateTestData,
}