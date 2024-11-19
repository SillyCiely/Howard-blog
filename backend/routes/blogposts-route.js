var express = require('express')
var router = express.Router()

// user data
// const jwt = require('jsonwebtoken')
const authenticateUser = require('../middleware/authenticateUser')
const {Users} = require('../models/users-schema')

// import blogpost model
const Post = require('../models/blogposts-schema')
const postTestData = require('../models/test-data/blogposts-testdata')
const {generateID} = require('../models/utils')

// multer middleware for file uploads
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

/* ----------------------------------- */
/*             GET REQUESTS            */
/* ----------------------------------- */

// get all blogposts
router.get('/posts', async (req, res) => {
    try {
        // const posts = await Post.find()
        // aggregate query to join collections for more details
        const posts = await Post.aggregate(
            [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'authorId',
                        foreignField: 'userId',
                        as: 'author',
                    },
                },
                {
                    $project: {
                        'author.userId': 0,
                        // maintain author.username
                        'author.email': 0,
                        'author.password': 0,
                        'author.role': 0,
                    },
                },
            ],
            {
                promoteBuffers: true,
            }
        )

        res.json(posts)
    } catch (error) {
        console.error('Error fetching posts: ', error)
        res.status(500).send('Error')
    }
})

// get blogpost by postId
router.get('/posts/:postId', async (req, res) => {
    try {
        const post = await Post.findOne({postId: req.params.postId})
        const author = await Users.findOne({userId: post.authorId})
        const authorName = author.username

        if (post) {
            res.json({post: post, author: authorName})
        } else {
            res.status(404).send('Post not found')
        }
    } catch (error) {
        console.error('Error fetching post', error)
        res.status(500).send('Error')
    }
})

// get blogposts by a particular author
router.get('/posts/author/:authorId', async (req, res) => {
    try {
        const authorPosts = await Post.find({authorId: req.params.authorId})
        res.json(authorPosts)
    } catch (error) {
        console.error('Error fetching author posts', error)
        res.status(500).send('Error')
    }
})

// get blogposts by category
router.get('/posts/category/:category', async (req, res) => {
    try {
        const categoryPosts = await Post.find({category: req.params.category})
        res.json(categoryPosts)
    } catch (error) {
        console.error('Error fetching category posts', error)
        res.status(500).send('Error')
    }
})

/* ----------------------------------- */
/*            POST REQUESTS            */
/* ----------------------------------- */

// create a new blogpost
router.post('/posts/new', authenticateUser, upload.single('image'), async (req, res) => {
    try {
        const newPost = await Post.create({
            postId: generateID(),
            postTitle: req.body.postTitle,
            authorId: req.user.userId,
            // dateStamp has default value provided in schema
            category: req.body.category,
            postBody: req.body.postBody,
            image: req.file.buffer,
            imageMimeType: req.file.mimetype,
            likes: 0,
            usersLikes: [],
        })

        // await newPost.save()
        res.status(201).send('Post created')
    } catch (error) {
        console.error('Error creating post', error)
        res.status(500).send('Error')
    }
})

/* ----------------------------------- */
/*             PUT REQUESTS            */
/* ----------------------------------- */

// update a blogpost
router.put('/posts/:postId/update', authenticateUser, async (req, res) => {
    try {
        const post = await Post.findOne({postId: req.params.postId})

        // user must be author or admin to update post
        if (post.authorId === req.user.userId || req.user.role === 'admin') {
            await Post.updateOne({postId: req.params.postId}, req.body)
            res.status(200).send('Post updated')
        } else {
            res.status(403).send('Unauthorized')
        }
    } catch (error) {
        console.error('Error updating post', error)
        res.status(500).send('Error')
    }
})

// like a blogpost
router.put('/posts/:postId/like', authenticateUser, async (req, res) => {
    try {
        const post = await Post.findOne({postId: req.params.postId})
        if (!post.usersLikes.includes(req.user.userId)) {
            post.likes += 1
            post.usersLikes.push(req.user.userId)
            await post.save()
            res.status(200).send('Post liked')
        } else {
            res.status(403).send('Already liked')
        }
    } catch (error) {
        console.error('Error liking post', error)
        res.status(500).send('Error')
    }
})

/* ----------------------------------- */
/*            DELETE REQUESTS          */
/* ----------------------------------- */

// delete a blogpost
router.delete('/posts/:postId/delete', authenticateUser, async (req, res) => {
    try {
        const post = await Post.findOne({postId: req.params.postId})

        // user must be author or admin to delete post
        if (post.authorId === req.user.userId || req.user.role === 'admin') {
            await Post.deleteOne({postId: req.params.postId})
            res.status(200).send('Post deleted')
        } else {
            res.status(403).send('Unauthorized')
        }
    } catch (error) {
        console.error('Error deleting post', error)
        res.status(500).send('Error')
    }
})

/* ----------------------------------- */
/*          POPULATE TEST DATA         */
/* ----------------------------------- */

// populate test data
router.post('/posts/populate-test-data', async (req, res) => {
    try {
        await Post.deleteMany({})
        await Post.insertMany(postTestData)
        res.status(201).send('Test data populated')
    } catch (error) {
        console.error('Error populating test data', error)
        res.status(500).send('Error')
    }
})

module.exports = router
