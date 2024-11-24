const Post = require('../models/blogposts-schema')
const { Users } = require('../models/users-schema')
let { generateID } = require('../models/utils')
const postTestData = require('../models/test-data/blogposts-testdata')

const getAllPosts = async (req, res) => {
    try {
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
                    // excluded fields from author object
                    // author.username is the only field included
                    $project: {
                        'author.userId': 0,
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
}

const getPostById = async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.postId })
        const author = await Users.findOne({ userId: post.authorId })
        const authorName = author.username

        if (post) {
            res.json({ post: post, author: authorName })
        } else {
            res.status(404).send('Post not found')
        }
    } catch (error) {
        console.error('Error fetching post', error)
        res.status(500).send('Error')
    }
}

const getPostsByAuthor = async (req, res) => {
    try {
        const authorPosts = await Post.find({ authorId: req.params.authorId })
        res.json(authorPosts)
    } catch (error) {
        console.error('Error fetching author posts', error)
        res.status(500).send('Error')
    }
}

const getPostsByCategory = async (req, res) => {
    try {
        const categoryPosts = await Post.find({ category: req.params.category })
        res.json(categoryPosts)
    } catch (error) {
        console.error('Error fetching category posts', error)
        res.status(500).send('Error')
    }
}

const createPost = async (req, res) => {
    try {
        const newPost = await Post.create({
            postId: generateID(),
            postTitle: req.body.postTitle,
            authorId: req.user.userId,
            category: req.body.category,
            postBody: req.body.postBody,
            image: req.file.buffer,
            imageMimeType: req.file.mimetype,
        })
        res.status(201).send('Post created')
    } catch (error) {
        console.error('Error creating post: ', error)
        res.status(500).send('Error')
    }
}

const updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.postId })

        if (!post) {
            return res.status(404).send('Post not found')
        }

        if (post.authorId === req.user.userId || req.user.role === 'admin') {
            await Post.updateOne({ postId: req.params.postId }, req.body)
            res.status(200).send('Post updated successfully')
        } else {
            res.status(403).send('Unauthorized')
        }
    } catch (error) {
        console.error('Error updating post', error)
        res.status(500).send('Error updating post')
    }
}

const likePost = async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.postId })
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
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.postId })

        if (!post) {
            return res.status(404).send('Post not found')
        }

        if (post.authorId === req.user.userId || req.user.role === 'admin') {
            await Post.deleteOne({ postId: req.params.postId })
            res.status(200).send('Post deleted successfully')
        } else {
            res.status(403).send('Unauthorized')
        }
    } catch (error) {
        console.error('Error deleting post', error)
        res.status(500).send('Error')
    }
}

const populateTestData = async (req, res) => {
    try {
        await Post.deleteMany({})
        await Post.insertMany(postTestData)
        res.status(201).send('Test data populated')
    } catch (error) {
        console.error('Error populating test data', error)
        res.status(500).send('Error')
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    getPostsByAuthor,
    getPostsByCategory,
    createPost,
    updatePost,
    likePost,
    deletePost,
    populateTestData,
}