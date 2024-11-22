import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Styles/navigation.css'

const Navigation = () => {

    return (
        <nav className={`flex-row-container`}>
                <Link to={'/'}>Home</Link>

            <div id={`right-aligned-links`}>
                <Link to={'/about'}>About</Link>
                <Link to={'/posts'}>Posts</Link>
            </div>
        </nav>
    )
}

export default Navigation