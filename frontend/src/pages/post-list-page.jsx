import axios from 'axios'
import React, { useState, useEffect } from 'react'
import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import PostInfo from "../components/post-info";
import { Link } from "react-router-dom";

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
                {/*<Link to={`/posts/${post.postId}`} className='box-container flex-col-container'>*/}
                    <div className='box-container flex-col-container'>
                        {blogpost.map(post => (
                            <PostInfo key={post.postId} post={post}/>
                        ))}
                    </div>
                {/*</Link>*/}
            </ContentContainer>
        </PageTemplate>
    )
}

export default PostListPage