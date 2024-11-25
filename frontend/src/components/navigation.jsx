import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/navigation.css'

const Navigation = () => {

    return (
        <nav className={`flex-row-container space`}>
                <Link to={`/`}>Home</Link>

            <div id={`right-aligned-links`}>
                <Link to={`/about-me`}>About Me</Link>
                <Link to={`/posts`}>Posts</Link>
                <Link to={`/shorts`}>Shorts</Link>
                <Link to={`/operations`}>Operations</Link>
            </div>
        </nav>
    )
}

export default Navigation