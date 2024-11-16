const comments = [
  {
    commentId: '1',
    postId: '1',
    commenterId: '2',
    dateStamp: new Date('2023-01-02'),
    commentBody: 'Great introduction to gastroenterology!',
    likes: 5,
    usersLikes: ['2', '3']
  },
  {
    commentId: '2',
    postId: '1',
    commenterId: '3',
    dateStamp: new Date('2023-01-03'),
    commentBody: 'Very informative post, thanks!',
    likes: 3,
    usersLikes: ['1', '3']
  },
  {
    commentId: '3',
    postId: '2',
    commenterId: '1',
    dateStamp: new Date('2023-02-02'),
    commentBody: 'Interesting techniques discussed here.',
    likes: 4,
    usersLikes: ['1', '2']
  },
  {
    commentId: '4',
    postId: '2',
    commenterId: '3',
    dateStamp: new Date('2023-02-03'),
    commentBody: 'I learned a lot from this post.',
    likes: 2,
    usersLikes: ['2']
  },
  {
    commentId: '5',
    postId: '3',
    commenterId: '2',
    dateStamp: new Date('2023-03-02'),
    commentBody: 'Cardiology advances are fascinating!',
    likes: 6,
    usersLikes: ['1', '2', '3']
  },
  {
    commentId: '6',
    postId: '3',
    commenterId: '1',
    dateStamp: new Date('2023-03-03'),
    commentBody: 'Thanks for sharing the latest updates.',
    likes: 3,
    usersLikes: ['1', '3']
  }
]

module.exports = comments