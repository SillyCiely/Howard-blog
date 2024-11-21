const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authenticateUser')
// const multer = require('multer')
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

const {
    getCommentById,
    getCommentsByPostId,
    getCommentsByUserId,
    createComment,
    updateComment,
    likeComment,
    deleteComment,
    populateTestData
} = require('../controllers/comments-controller')

// GET REQUESTS
router.get('/comments/:commentID', getCommentById)
router.get('/posts/:postId/comments', getCommentsByPostId)
router.get('/users/:userId/comments', getCommentsByUserId)

// POST REQUESTS
router.post('/comments/new', authenticateUser, createComment)
router.post('/comments/:commentID/like', authenticateUser, likeComment)

// PUT REQUESTS
router.put('/comments/:commentID/update', authenticateUser, updateComment)

// DELETE REQUESTS
router.delete('/comments/:commentID/delete', authenticateUser, deleteComment)

// POPULATE TEST DATA
router.post('/comments/populate-test-data', populateTestData)


module.exports = router