import axios from 'axios'
import React, { useState, useEffect } from 'react'
import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import PostInfo from "../components/post-info";

const PostListPage = () => {
    // const api = import.meta.env.VITE_SERVER_URL
    // fixme: set to reference to .env file
    const api = "http://localhost:3000"
    const [blogpost, setBlogpost] = useState([])

    useEffect(() => {
        const url = api + '/posts/'
        console.log('Request URL:', url);
        axios
            .get(url)
            .then((res) => {
                setBlogpost(res.data)
            })
            .catch((error) => console.log(error))
    }, [])

    return (
        <PageTemplate title={`Recent Posts`}>
            <ContentContainer>
                <div className='box-container'>
                    {blogpost.map(post => (
                        <PostInfo key={post.postId} post={post}/>
                    ))}
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default PostListPage