import React from 'react'

/**
 * MobileFrame — wraps the entire app in a phone-sized frame on desktop.
 * On actual mobile (<430px), this renders transparently as a normal div.
 */
const MobileFrame = ({ children }) => {
  return (
    <div className="phone-frame">
      <div className="phone-content">
        {children}
      </div>
    </div>
  )
}

export default MobileFrame
