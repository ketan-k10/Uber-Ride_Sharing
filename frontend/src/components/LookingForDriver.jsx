import React from 'react'

const RideInfoRow = ({ icon, label, value, border = true }) => (
    <div className={`flex items-center gap-4 p-4 ${border ? 'border-b border-borderColor' : ''}`}>
        <div className='h-9 w-9 rounded-full bg-inputBg border border-borderColor flex items-center justify-center flex-shrink-0'>
            <i className={`${icon} text-textMuted`}></i>
        </div>
        <div>
            <p className='text-xs text-textMuted uppercase tracking-widest mb-0.5'>{label}</p>
            <h3 className='text-sm font-medium text-textMain leading-snug'>{value}</h3>
        </div>
    </div>
)

const LookingForDriver = (props) => {
    return (
        <div>
            {/* Visual drag handle */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-borderColor rounded-full'></div>

            <h3 className='text-2xl font-serif font-semibold text-textMain mb-2'>Finding your driver</h3>
            <p className='text-textMuted text-sm mb-6'>Sit tight, we're looking for a nearby captain…</p>

            <div className='flex justify-center mb-6'>
                <div className='relative'>
                    <div className='h-16 w-16 rounded-full border-4 border-borderColor border-t-accent animate-spin'></div>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <i className="ri-car-line text-2xl text-textMuted"></i>
                    </div>
                </div>
            </div>

            <div className='bg-inputBg rounded-xl border border-borderColor overflow-hidden mb-4'>
                <RideInfoRow icon="ri-map-pin-user-fill" label="Pickup" value={props.pickup} />
                <RideInfoRow icon="ri-map-pin-2-fill" label="Destination" value={props.destination} />
                <RideInfoRow icon="ri-currency-line" label="Fare" value={`₹${props.fare[props.vehicleType]} · Cash`} border={false} />
            </div>

            <button
                onClick={() => props.setVehicleFound(false)}
                className='w-full bg-surface border border-borderColor hover:bg-inputBg text-textMain font-medium py-4 rounded-2xl transition text-sm'
            >
                Cancel
            </button>
        </div>
    )
}

export default LookingForDriver