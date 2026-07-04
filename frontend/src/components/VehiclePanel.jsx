import React, { useState } from 'react'
import { VEHICLE_LIST } from '../constants/vehicles'
import VehicleImage from './VehicleImage'

const VehiclePanel = (props) => {
    const [ selected, setSelected ] = useState(null)

    return (
        <div>
            {/* Visual drag handle */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-borderColor rounded-full'></div>

            {/* Header with a clear back button */}
            <div className='flex items-center gap-2 mb-4 -mt-1'>
                <button
                    onClick={() => props.setVehiclePanel(false)}
                    className='h-9 w-9 -ml-1 flex items-center justify-center rounded-full hover:bg-inputBg text-textMain transition'
                    aria-label='Go back'
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <h3 className='text-2xl font-serif font-semibold text-textMain'>Choose a Ride</h3>
            </div>
            <p className='text-sm text-textMuted mb-5'>Select a ride type, then confirm.</p>

            <div className='space-y-3 mb-5'>
                {VEHICLE_LIST.map(v => (
                    <div
                        key={v.key}
                        onClick={() => { setSelected(v.key); props.selectVehicle(v.key) }}
                        className={`flex items-center justify-between p-4 bg-inputBg border cursor-pointer rounded-xl transition ${selected === v.key ? 'border-primary ring-1 ring-primary' : 'border-borderColor hover:border-primary'}`}
                    >
                        <VehicleImage type={v.key} src={v.img} className='h-12 w-16 object-contain flex-shrink-0' />
                        <div className='flex-1 ml-4'>
                            <h4 className='text-sm font-semibold text-textMain'>
                                {v.name} <span className='font-normal text-textMuted'>· {v.seats} <i className="ri-user-3-fill text-xs"></i></span>
                            </h4>
                            <p className='text-xs text-textMuted'>{v.eta} · {v.desc}</p>
                        </div>
                        <div className='text-right'>
                            <h2 className='text-base font-semibold text-textMain'>₹{props.fare[v.key]}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <button
                disabled={!selected}
                onClick={() => props.setConfirmRidePanel(true)}
                className={`w-full font-medium py-4 rounded-2xl transition text-sm shadow-sm ${selected ? 'bg-primary hover:bg-primaryHover text-white' : 'bg-inputBg text-textMuted cursor-not-allowed'}`}
            >
                {selected ? 'Confirm Ride' : 'Select a ride type'}
            </button>
        </div>
    )
}

export default VehiclePanel
