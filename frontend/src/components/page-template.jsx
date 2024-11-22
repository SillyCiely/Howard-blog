import React, { useEffect, useState } from 'react'
import '../styles/page-styling.css'

const backgrounds = [
    'var(--placeholder-bg)'
]

const PageTemplate = ({ children, className, title }) => {
    const [background, setBackground] = useState('')

    // useEffect will run because the dependency array is empty
    useEffect(() => {
        const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]
        setBackground(randomBackground)
    }, [])

    return (
        <div className={`page ${className}`} style={{ '--placeholder-background-variable': background }}>
            {title && <h1>{title}</h1>}
            {children}
        </div>
    )
}

export default PageTemplate