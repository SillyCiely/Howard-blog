import React from 'react'
import { Link } from 'react-router-dom'

const PostInfo = ({post, onClick}) => {
    console.log(post)
    return (
        <div className={`flex-row-container gap`}>
            <img src='https://via.placeholder.com/300' alt='thumbnail' className={`thumbnail`}/>

            <div className={`info-text`}>
                <Link to={`/posts/${post.postId}`} className={`card-title-text`}>
                    <h2>{post.postTitle}</h2>
                </Link>
                <h3 className={`card-author-text`}>written by {post.author[0].username}</h3>
                <p className={`card-body-text`}>{post.postBody}</p>
            </div>
        </div>
    )
}

export default PostInfo
