import React, { useState } from 'react'
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

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: { rideId: props.ride._id, otp: otp },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }
    }

    return (
        <div>
            {/* Visual drag handle */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-borderColor rounded-full'></div>

            <h3 className='text-2xl font-serif font-semibold text-textMain mb-6'>Confirm to Start</h3>

            <div className='flex items-center justify-between p-4 bg-inputBg border border-borderColor rounded-xl mb-6'>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-11 w-11 rounded-full object-cover border border-borderColor' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" />
                    <div>
                        <h2 className='text-base font-medium text-textMain capitalize'>{props.ride?.user.fullname.firstname}</h2>
                        <p className='text-xs text-textMuted'>Rider · 2.2 KM away</p>
                    </div>
                </div>
                <div className='text-right'>
                    <span className='text-base font-semibold text-textMain'>₹{props.ride?.fare}</span>
                    <p className='text-xs text-textMuted'>Cash</p>
                </div>
            </div>

            <div className='bg-inputBg rounded-xl border border-borderColor overflow-hidden mb-6'>
                <RideInfoRow icon="ri-map-pin-user-fill" label="Pickup" value={props.ride?.pickup} />
                <RideInfoRow icon="ri-map-pin-2-fill" label="Destination" value={props.ride?.destination} border={false} />
            </div>

            <form onSubmit={submitHander}>
                <label className='block text-sm font-medium text-textMain mb-2'>Enter Rider OTP</label>
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="text"
                    maxLength={6}
                    className='bg-inputBg px-5 py-4 font-mono text-xl tracking-[0.3em] text-center rounded-xl w-full border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none placeholder:text-textMuted/50 mb-5'
                    placeholder='— — — — — —'
                />
                <button className='w-full bg-primary hover:bg-primaryHover text-white font-medium p-4 rounded-xl transition mb-3 shadow-sm'>
                    Start Ride
                </button>
                <button
                    type='button'
                    onClick={() => { props.setConfirmRidePopupPanel(false); props.setRidePopupPanel(false) }}
                    className='w-full bg-white border border-borderColor hover:bg-inputBg text-textMuted font-medium p-3.5 rounded-xl transition text-sm'
                >Cancel</button>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp