import React, { useEffect, useState } from 'react'

const ImageRenderer = ({ imageData, imageMimeType, className }) => {
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        if (imageData && imageMimeType) {
            const byteArray = new Uint8Array(imageData)
            const blob = new Blob([byteArray], { type: imageMimeType })
            const url = URL.createObjectURL(blob)
            setImageUrl(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [imageData, imageMimeType])

    return (
        <div className={`thumbnail-container`}>
            {imageUrl ? (
                <img src={imageUrl} alt='Rendered from binary data' className={className} />
            ) : (
                <p>Loading image...</p>
            )}
        </div>
    )
}
export default ImageRenderer