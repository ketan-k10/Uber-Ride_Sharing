import React from 'react'

const LocationSearchPanel = ({ suggestions, setPanelOpen, setPickup, setDestination, activeField, setActiveField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
            // Move the user straight to the destination field
            setActiveField('destination')
        } else if (activeField === 'destination') {
            setDestination(suggestion)
            // Both locations chosen — collapse the suggestions panel
            setPanelOpen(false)
        }
    }

    return (
        <div className='py-2'>
            {suggestions.length === 0 && (
                <p className='text-center text-textMuted text-sm py-8'>Start typing to see suggestions…</p>
            )}
            {suggestions.map((elem, idx) => (
                <div
                    key={idx}
                    onClick={() => handleSuggestionClick(elem)}
                    className='flex gap-4 p-3 hover:bg-inputBg border border-transparent hover:border-borderColor rounded-xl items-center my-1 cursor-pointer transition'
                >
                    <div className='h-9 w-9 rounded-full bg-inputBg border border-borderColor flex items-center justify-center flex-shrink-0'>
                        <i className="ri-map-pin-line text-textMuted text-sm"></i>
                    </div>
                    <h4 className='text-sm font-medium text-textMain leading-snug'>{elem}</h4>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel