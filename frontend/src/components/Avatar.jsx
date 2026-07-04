import React, { useState, useEffect } from 'react'

// Avatar that falls back to a person icon if the image fails to load.
const Avatar = ({ src, className = '' }) => {
    const [ errored, setErrored ] = useState(false)

    useEffect(() => { setErrored(false) }, [ src ])

    if (errored || !src) {
        return (
            <span className={`inline-flex items-center justify-center bg-inputBg text-textMuted ${className}`}>
                <i className="ri-user-3-fill text-lg"></i>
            </span>
        )
    }

    return (
        <img
            src={src}
            alt='avatar'
            className={className}
            onError={() => setErrored(true)}
        />
    )
}

export default Avatar
