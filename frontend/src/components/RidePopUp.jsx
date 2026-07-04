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

const RidePopUp = (props) => {
    return (
        <div>
            {/* Visual drag handle */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-borderColor rounded-full'></div>

            <h3 className='text-2xl font-serif font-semibold text-textMain mb-6'>New Ride Request</h3>

            <div className='flex items-center justify-between p-4 bg-inputBg border border-borderColor rounded-xl mb-6'>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-11 w-11 rounded-full object-cover border border-borderColor' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" />
                    <div>
                        <h2 className='text-base font-medium text-textMain capitalize'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                        <p className='text-xs text-textMuted'>Rider</p>
                    </div>
                </div>
                <div className='text-right'>
                    <span className='text-base font-semibold text-textMain'>2.2 KM</span>
                    <p className='text-xs text-textMuted'>away</p>
                </div>
            </div>

            <div className='bg-inputBg rounded-xl border border-borderColor overflow-hidden mb-6'>
                <RideInfoRow icon="ri-map-pin-user-fill" label="Pickup" value={props.ride?.pickup} />
                <RideInfoRow icon="ri-map-pin-2-fill" label="Destination" value={props.ride?.destination} />
                <RideInfoRow icon="ri-currency-line" label="Fare" value={`₹${props.ride?.fare} · Cash`} border={false} />
            </div>

            <div className='flex gap-3 w-full'>
                <button
                    onClick={() => { props.setRidePopupPanel(false) }}
                    className='w-1/3 bg-white border border-borderColor hover:bg-inputBg text-textMuted font-medium p-3.5 rounded-xl transition text-sm'
                >Ignore</button>
                <button
                    onClick={() => props.confirmRide()}
                    className='flex-1 bg-primary hover:bg-primaryHover text-white font-medium p-3.5 rounded-xl transition text-sm shadow-sm'
                >Accept Ride</button>
            </div>
        </div>
    )
}

export default RidePopUp