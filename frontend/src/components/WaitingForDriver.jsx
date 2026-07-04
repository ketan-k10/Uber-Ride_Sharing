import React from 'react'
import Avatar from './Avatar'

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

const WaitingForDriver = (props) => {
    return (
        <div>
            <button
                className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-borderColor rounded-full hover:bg-textMuted transition'
                onClick={() => props.setWaitingForDriver(false)}
            ></button>

            <h3 className='text-2xl font-serif font-semibold text-textMain mb-6'>Driver is on the way</h3>

            <div className='flex items-center justify-between p-4 bg-inputBg border border-borderColor rounded-xl mb-6'>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-11 w-11 rounded-full object-cover border border-borderColor' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" />
                    <div>
                        <h2 className='text-base font-medium text-textMain capitalize'>{props.ride?.captain.fullname.firstname}</h2>
                        <p className='text-xs text-textMuted'>{props.ride?.captain.vehicle.plate}</p>
                    </div>
                </div>
                <div className='text-right'>
                    <div className='inline-flex items-center gap-1 bg-surface border border-borderColor rounded-lg px-3 py-2'>
                        <i className="ri-lock-password-line text-textMuted text-sm"></i>
                        <span className='text-base font-mono font-bold text-textMain tracking-widest'>{props.ride?.otp}</span>
                    </div>
                    <p className='text-xs text-textMuted mt-1'>Share with captain</p>
                </div>
            </div>

            <div className='bg-inputBg rounded-xl border border-borderColor overflow-hidden'>
                <RideInfoRow icon="ri-map-pin-user-fill" label="Pickup" value={props.ride?.pickup} />
                <RideInfoRow icon="ri-map-pin-2-fill" label="Destination" value={props.ride?.destination} />
                <RideInfoRow icon="ri-currency-line" label="Fare" value={`₹${props.ride?.fare} · Cash`} border={false} />
            </div>
        </div>
    )
}

export default WaitingForDriver