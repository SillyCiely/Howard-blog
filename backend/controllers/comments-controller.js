const Comment = require('../models/comments-schema')
const { Users } = require('../models/users-schema')
const commentsTestData = require('../models/test-data/comments-testdata')
var { generateID } = require('../models/users-model')

const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findOne({ cid: req.params.cid })
        if (comment) {
            res.json(comment)
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
            res.status(404).send('No comments found for this post')
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
        const { body } = req.body
        const cid = generateID()
        const userId = req.user.id

        const newComment = await Comment.create({
            cid,
            userId,
            body,
            createdAt: new Date(),
            commentImage: req.file ? req.file.buffer : undefined,
        })

        res.status(201).json(newComment)
    } catch (error) {
        console.error('Error creating comment: ', error)
        res.status(500).send('Error creating comment')
    }
}

const updateComment = async (req, res) => {
    try {
        const { commentID } = req.params
        const { body } = req.body

        const comment = await Comment.findOne({ cid: commentID })
        if (!comment) {
            return res.status(404).send('Comment not found')
        }
        if (comment.userId !== req.user.id) {
            return res.status(403).send('You do not have permission to update this comment')
        }

        comment.body = body
        await comment.save()

        res.status(200).json(comment)
    } catch (error) {
        console.error('Error updating comment: ', error)
        res.status(500).send('Error updating comment')
    }
}

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({ cid: req.params.cid })
        if (!comment) {
            return res.status(404).send('Comment not found')
        }
        if (comment.userId !== req.user.id) {
            return res
                .status(403)
                .send('You do not have permission to delete this comment')
        }
        await Comment.deleteOne({ cid: req.params.cid })
        res.status(200).send('Comment deleted successfully')
    } catch (error) {
        console.error('Error deleting comment: ', error)
        res.status(500).send('Error deleting comment')
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