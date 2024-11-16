const fs = require("fs");
const path = require("path");
const blogposts = [
    {
        postId: '1',
        postTitle: 'Introduction to Gastroenterology',
        authorId: '1',
        dateStamp: new Date('2023-01-01'),
        category: 'gastro',
        postBody: 'This is an introductory post about gastroenterology.',
        image: fs.readFileSync(
            path.resolve(__dirname, 'test-img/gastro-pic.jpg')
        ),
        imageMimeType: 'image/jpeg',
        likes: 10,
        usersLikes: ['1', '2']
    },
    {
        postId: '2',
        postTitle: 'Orthopedic Surgery Techniques',
        authorId: '2',
        dateStamp: new Date('2023-02-01'),
        category: 'ortho',
        postBody: 'Discussion on various orthopedic surgery techniques.',
        image: fs.readFileSync(
            path.resolve(__dirname, 'test-img/ortho-pic.png')
        ),
        imageMimeType: 'image/png',
        likes: 20,
        usersLikes: ['2', '3']
    },
    {
        postId: '3',
        postTitle: 'Cardiology Advances',
        authorId: '1',
        dateStamp: new Date('2023-03-01'),
        category: 'cardio',
        postBody: 'Latest advances in cardiology.',
        image: fs.readFileSync(
            path.resolve(__dirname, 'test-img/cardio-pic.jpg')
        ),
        imageMimeType: 'image/jpeg',
        likes: 30,
        usersLikes: ['1', '3']
    }
]

module.exports = blogposts