import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {
    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    useGSAP(() => {
        gsap.to(finishRidePanelRef.current, { transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)', duration: 0.35 })
    }, [ finishRidePanel ])

    return (
        <div className='h-full relative overflow-hidden bg-background flex flex-col'>

            {/* Map */}
            <div className='flex-1 relative'>
                <LiveTracking />
                <div className='absolute top-5 left-4 right-4 flex items-center justify-between z-10'>
                    <div className='bg-surface/90 px-4 py-2 rounded-2xl backdrop-blur-md border border-borderColor shadow-sm'>
                        <span className='text-base font-serif font-semibold text-textMain'>
                            Smart<span className="text-primary">-Ride</span>
                        </span>
                    </div>
                    <Link to='/captain-home' className='h-10 w-10 bg-surface/90 backdrop-blur-md border border-borderColor flex items-center justify-center rounded-full shadow-sm'>
                        <i className="ri-logout-box-r-line text-textMain"></i>
                    </Link>
                </div>
            </div>

            {/* Bottom action bar — tap to open finish panel */}
            <div
                className='bg-surface border-t border-borderColor px-5 py-5 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] cursor-pointer'
                onClick={() => setFinishRidePanel(true)}
            >
                <div className='flex justify-center mb-4'>
                    <div className='w-10 h-1 bg-borderColor rounded-full'></div>
                </div>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-xs text-textMuted uppercase tracking-widest mb-0.5'>En Route</p>
                        <h4 className='text-lg font-serif font-semibold text-textMain'>4 KM away</h4>
                    </div>
                    <button
                        className='bg-primary hover:bg-primaryHover text-white font-medium py-3 px-7 rounded-2xl transition shadow-sm text-sm'
                        onClick={(e) => { e.stopPropagation(); setFinishRidePanel(true) }}
                    >
                        Complete Ride
                    </button>
                </div>
            </div>

            {/* Finish Ride slide-up */}
            <div ref={finishRidePanelRef} className='absolute bottom-0 left-0 right-0 z-40 translate-y-full bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto'>
                <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    )
}

export default CaptainRiding