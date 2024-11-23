import React from 'react'
import { Link } from 'react-router-dom'

const PostInfo = ({post, onClick}) => {
    console.log(post)
    return (
        <div>
            <div className='thumbnail'>
                <img src='https://via.placeholder.com/150' alt='thumbnail'/>
            </div>

            <div className='info-text'>
                <Link to={`/posts/${post.postId}`}>
                    <div>{post.postTitle}</div>
                </Link>
                <div className='post-author'>written by {post.author[0]?.name}</div>
                <div>{post.postBody}</div>
            </div>
        </div>
    )
}

export default PostInfo
