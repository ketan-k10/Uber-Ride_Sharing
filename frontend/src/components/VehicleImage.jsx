import React, { useState, useEffect } from 'react'

// Renders a vehicle image and, if it fails to load, falls back to a clean
// icon instead of a broken-image box.
const FALLBACK_ICON = {
    car: 'ri-taxi-line',
    moto: 'ri-motorbike-line',
    auto: 'ri-riding-line',
}

const VehicleImage = ({ type, src, className = '', iconSize = 'text-3xl' }) => {
    const [ errored, setErrored ] = useState(false)

    // Reset the error state if the source changes
    useEffect(() => { setErrored(false) }, [ src ])

    if (errored || !src) {
        return (
            <span className={`inline-flex items-center justify-center ${className}`}>
                <i className={`${FALLBACK_ICON[type] || 'ri-car-line'} ${iconSize} text-textMuted`}></i>
            </span>
        )
    }

    return (
        <img
            src={src}
            alt={type}
            className={className}
            onError={() => setErrored(true)}
        />
    )
}

export default VehicleImage
