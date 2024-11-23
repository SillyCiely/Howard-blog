import React from 'react'

const ContentContainer = ({ children, className, id }) => {
  return (
    <div className={`page-content ${className}`} id={id}>
      {children}
    </div>
  )
}

export default ContentContainer
