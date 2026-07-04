import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {
    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
    const [ ride, setRide ] = useState(null)
    const [ mapError, setMapError ] = useState(false)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        socket.emit('join', { userId: captain._id, userType: 'captain' })
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: { ltd: pos.coords.latitude, lng: pos.coords.longitude }
                    })
                })
            }
        }
        const interval = setInterval(updateLocation, 10000)
        updateLocation()
        return () => clearInterval(interval)
    }, [])

    // Register the new-ride listener once (with cleanup)
    useEffect(() => {
        const onNewRide = (data) => {
            setRide(data)
            setRidePopupPanel(true)
        }
        socket.on('new-ride', onNewRide)
        return () => socket.off('new-ride', onNewRide)
    }, [ socket ])

    async function confirmRide() {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride._id, captainId: captain._id
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
        } catch {
            // keep the request panel open so the captain can retry
        }
    }

    return (
        <div className='h-full relative overflow-hidden bg-background flex flex-col'>

            {/* Map area */}
            <div className='flex-1 relative bg-inputBg overflow-hidden'>
                {!mapError ? (
                    <img
                        className='w-full h-full object-cover'
                        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                        alt="Radar Map"
                        onError={() => setMapError(true)}
                    />
                ) : (
                    <div className='absolute inset-0 flex items-center justify-center text-textMuted'>
                        <i className="ri-map-2-line text-6xl"></i>
                    </div>
                )}

                {/* Top bar */}
                <div className='absolute top-5 left-4 right-4 flex items-center justify-between z-10'>
                    <div className='bg-surface/90 px-4 py-2 rounded-2xl backdrop-blur-md border border-borderColor shadow-sm'>
                        <span className='text-base font-serif font-semibold text-textMain'>
                            Smart<span className="text-primary">-Ride</span>
                            <span className='text-xs text-textMuted font-sans font-normal ml-1'>· Captain</span>
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/captain/logout')}
                        title='Log out'
                        className='h-10 w-10 bg-surface/90 backdrop-blur-md border border-borderColor flex items-center justify-center rounded-full shadow-sm text-textMain hover:bg-inputBg transition'
                    >
                        <i className="ri-logout-box-r-line"></i>
                    </button>
                </div>
            </div>

            {/* Captain Dashboard Panel — bottom */}
            <div className='bg-surface border-t border-borderColor px-5 py-5 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.06)]'>
                <div className='flex justify-center mb-4'>
                    <div className='w-10 h-1 bg-borderColor rounded-full'></div>
                </div>
                <CaptainDetails />
            </div>

            {/* New ride request — hidden below the frame until a ride arrives */}
            <div className={`absolute bottom-0 left-0 right-0 z-40 bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto transition-transform duration-300 ${ridePopupPanel ? 'translate-y-0' : 'translate-y-full'}`}>
                <RidePopUp ride={ride} setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} confirmRide={confirmRide} />
            </div>

            {/* Confirm to start (OTP) — hidden until the ride is accepted */}
            <div className={`absolute bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[90%] overflow-y-auto transition-transform duration-300 ${confirmRidePopupPanel ? 'translate-y-0' : 'translate-y-full'}`}>
                <ConfirmRidePopUp ride={ride} setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome
