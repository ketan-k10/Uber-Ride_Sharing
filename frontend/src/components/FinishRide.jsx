import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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

const FinishRide = (props) => {
    const navigate = useNavigate()

    async function endRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: props.ride._id
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (response.status === 200) {
            navigate('/captain-home')
        }
    }

    return (
        <div>
            {/* Visual drag handle */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-borderColor rounded-full'></div>

            {/* Header with a clear back button */}
            <div className='flex items-center gap-2 mb-6 -mt-1'>
                <button
                    onClick={() => props.setFinishRidePanel(false)}
                    className='h-9 w-9 -ml-1 flex items-center justify-center rounded-full hover:bg-inputBg text-textMain transition'
                    aria-label='Go back'
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <h3 className='text-2xl font-serif font-semibold text-textMain'>Finish this Ride</h3>
            </div>

            <div className='flex items-center justify-between p-4 bg-inputBg border border-borderColor rounded-xl mb-6'>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-11 w-11 rounded-full object-cover border border-borderColor' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" />
                    <div>
                        <h2 className='text-base font-medium text-textMain capitalize'>{props.ride?.user.fullname.firstname}</h2>
                        <p className='text-xs text-textMuted'>Rider</p>
                    </div>
                </div>
                <div className='text-right'>
                    <span className='text-base font-semibold text-textMain'>₹{props.ride?.fare}</span>
                    <p className='text-xs text-textMuted'>Cash</p>
                </div>
            </div>

            <div className='bg-inputBg rounded-xl border border-borderColor overflow-hidden mb-8'>
                <RideInfoRow icon="ri-map-pin-user-fill" label="Pickup" value={props.ride?.pickup} />
                <RideInfoRow icon="ri-map-pin-2-fill" label="Destination" value={props.ride?.destination} border={false} />
            </div>

            <button
                onClick={endRide}
                className='w-full bg-primary hover:bg-primaryHover text-white font-medium p-4 rounded-xl transition text-base shadow-sm'
            >
                Complete & Finish Ride
            </button>
        </div>
    )
}

export default FinishRide