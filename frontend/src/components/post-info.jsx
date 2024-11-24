import React from 'react'
import { Link } from 'react-router-dom'
import ImageRenderer from "../utils/image-renderer";

const PostInfo = ({post, onClick}) => {
    const imageData = post?.image?.data || []
    const imageMimeType = post.imageMimeType

    return (
        <div className={`flex-row-container gap`}>
            <ImageRenderer imageData={imageData} imageMimeType={imageMimeType} alt='thumbnail' className={`thumbnail`}/>

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
