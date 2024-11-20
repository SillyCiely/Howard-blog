const express = require('express')
const router = express.Router()
const {
    populateTestData,
    getCommentsByUserId,
    createComment,
    updateComment,
    deleteComment,
} = require('../controllers/comments-controller')
const { authenticateUser } = require('../middleware/authenticateUser')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// GET REQUESTS
router.get('/users/:userId/comments', getCommentsByUserId)

// POST REQUESTS
router.post('/comments/new', authenticateUser, upload.single('commentImage'), createComment)

// PUT REQUESTS
router.put('comments/:commentID/update', authenticateUser, updateComment)

// DELETE REQUESTS
router.delete('comments/:commentID/delete', authenticateUser, deleteComment)

// POPULATE TEST DATA
router.post('/comments/populate-test-data', populateTestData)


module.exports = router