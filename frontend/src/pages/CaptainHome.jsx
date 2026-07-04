import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {
    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

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

    socket.on('new-ride', (data) => { setRide(data); setRidePopupPanel(true) })

    async function confirmRide() {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id, captainId: captain._id
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    useGSAP(() => { gsap.to(ridePopupPanelRef.current, { transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)', duration: 0.35 }) }, [ ridePopupPanel ])
    useGSAP(() => { gsap.to(confirmRidePopupPanelRef.current, { transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)', duration: 0.35 }) }, [ confirmRidePopupPanel ])

    return (
        <div className='h-full relative overflow-hidden bg-background flex flex-col'>

            {/* Map — top 55% */}
            <div className='flex-1 relative bg-inputBg overflow-hidden'>
                <img
                    className='w-full h-full object-cover'
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt="Radar Map"
                />
                {/* Top bar */}
                <div className='absolute top-5 left-4 right-4 flex items-center justify-between z-10'>
                    <div className='bg-surface/90 px-4 py-2 rounded-2xl backdrop-blur-md border border-borderColor shadow-sm'>
                        <span className='text-base font-serif font-semibold text-textMain'>
                            Smart<span className="text-primary">-Ride</span>
                            <span className='text-xs text-textMuted font-sans font-normal ml-1'>· Captain</span>
                        </span>
                    </div>
                    <Link to='/captain-login' className='h-10 w-10 bg-surface/90 backdrop-blur-md border border-borderColor flex items-center justify-center rounded-full shadow-sm'>
                        <i className="ri-logout-box-r-line text-textMain"></i>
                    </Link>
                </div>
            </div>

            {/* Captain Dashboard Panel — bottom */}
            <div className='bg-surface border-t border-borderColor px-5 py-5 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.06)]'>
                <div className='flex justify-center mb-4'>
                    <div className='w-10 h-1 bg-borderColor rounded-full'></div>
                </div>
                <CaptainDetails />
            </div>

            {/* Ride popup panels */}
            <div ref={ridePopupPanelRef} className='absolute bottom-0 left-0 right-0 z-40 translate-y-full bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto'>
                <RidePopUp ride={ride} setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} confirmRide={confirmRide} />
            </div>

            <div ref={confirmRidePopupPanelRef} className='absolute bottom-0 left-0 right-0 z-50 translate-y-full bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[90%] overflow-y-auto'>
                <ConfirmRidePopUp ride={ride} setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome