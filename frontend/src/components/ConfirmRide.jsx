import React from 'react'
import { VEHICLES } from '../constants/vehicles'
import VehicleImage from './VehicleImage'

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

const ConfirmRide = (props) => {
    const vehicle = VEHICLES[props.vehicleType] || VEHICLES.car

    return (
        <div>
            {/* Visual drag handle */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-borderColor rounded-full'></div>

            {/* Header with a clear back button */}
            <div className='flex items-center gap-2 mb-6 -mt-1'>
                <button
                    onClick={() => props.setConfirmRidePanel(false)}
                    className='h-9 w-9 -ml-1 flex items-center justify-center rounded-full hover:bg-inputBg text-textMain transition'
                    aria-label='Go back'
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <h3 className='text-2xl font-serif font-semibold text-textMain'>Confirm your Ride</h3>
            </div>

            <div className='flex flex-col items-center mb-6'>
                <VehicleImage type={vehicle.key} src={vehicle.img} className='h-20 object-contain' iconSize='text-5xl' />
            </div>

            <div className='bg-inputBg rounded-xl border border-borderColor overflow-hidden mb-6'>
                <RideInfoRow icon="ri-map-pin-user-fill" label="Pickup" value={props.pickup} />
                <RideInfoRow icon="ri-map-pin-2-fill" label="Destination" value={props.destination} />
                <RideInfoRow icon="ri-currency-line" label="Fare" value={`₹${props.fare[props.vehicleType]} · Cash`} border={false} />
            </div>

            <button
                onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.setVehiclePanel(false)
                    props.createRide()
                }}
                className='w-full bg-primary hover:bg-primaryHover text-white font-medium p-4 rounded-xl transition text-base shadow-sm'
            >
                Confirm &amp; Find Driver
            </button>
        </div>
    )
}

export default ConfirmRide
