var express = require('express')
var router = express.Router()

const authenticateUser = require('../middleware/authenticateUser')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const {
    getAllPosts,
    getPostById,
    getPostsByAuthor,
    getPostsByCategory,
    createPost,
    updatePost,
    likePost,
    deletePost,
    populateTestData,
} = require('../controllers/blogposts-controller')

// GET REQUESTS
router.get('/posts', getAllPosts)
router.get('/posts/:postId', getPostById)
router.get('/posts/author/:authorId', getPostsByAuthor)
router.get('/posts/category/:category', getPostsByCategory)

// POST REQUESTS
router.post('/posts/new', authenticateUser, upload.single('image'), createPost)

// PUT REQUESTS
router.put('/posts/:postId/update', authenticateUser, updatePost)
router.put('/posts/:postId/like', authenticateUser, likePost)

// DELETE REQUESTS
router.delete('/posts/:postId/delete', authenticateUser, deletePost)

// POPULATE TEST DATA
router.post('/posts/populate-test-data', populateTestData)

module.exports = router