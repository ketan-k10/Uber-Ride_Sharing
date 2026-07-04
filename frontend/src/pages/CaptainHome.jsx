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
import LiveTracking from '../components/LiveTracking' // We can just use LiveTracking instead of gif, or keep gif if they prefer, but let's use a nice map placeholder

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
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: { ltd: position.coords.latitude, lng: position.coords.longitude }
                    })
                })
            }
        }
        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()
    }, [])

    socket.on('new-ride', (data) => {
        setRide(data)
        setRidePopupPanel(true)
    })

    async function confirmRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    useGSAP(function () {
        if (ridePopupPanel) { gsap.to(ridePopupPanelRef.current, { transform: 'translateY(0)' }) } 
        else { gsap.to(ridePopupPanelRef.current, { transform: 'translateY(100%)' }) }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) { gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(0)' }) } 
        else { gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(100%)' }) }
    }, [ confirmRidePopupPanel ])

    return (
        <div className='h-screen flex flex-col md:flex-row relative overflow-hidden bg-background text-textMain'>
            
            {/* Sidebar equivalent on Desktop */}
            <div className='flex flex-col h-screen absolute md:relative top-0 w-full md:w-[450px] z-20 pointer-events-none md:pointer-events-auto'>
                
                {/* Top Nav */}
                <div className='fixed md:absolute p-6 top-0 flex items-center justify-between w-full md:w-[450px] pointer-events-auto z-30'>
                    <div className='text-2xl font-extrabold tracking-tight text-white drop-shadow-md bg-surface/80 px-3 py-1 rounded-lg backdrop-blur-md border border-slate-700'>
                        Smart<span className="text-primary">-Ride</span> <span className='text-xs text-accent font-normal'>Captain</span>
                    </div>
                    <Link to='/captain-login' className='h-10 w-10 bg-surface border border-slate-700 flex items-center justify-center rounded-full text-white hover:bg-slate-700 transition'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>

                {/* Dashboard Area - On mobile it's pushed to bottom 40%, on desktop it fills sidebar */}
                <div className='h-2/5 md:h-full w-full bg-surface shadow-[0_-5px_20px_rgba(0,0,0,0.5)] md:shadow-2xl relative pointer-events-auto md:border-r border-slate-700 mt-auto md:mt-24 p-6 flex flex-col'>
                    <CaptainDetails />
                </div>
            </div>

            {/* Map Area */}
            <div className='h-3/5 md:h-full w-full md:flex-1 absolute md:relative z-10 top-0 left-0 bg-background'>
                <img className='h-full w-full object-cover opacity-80' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Radar Map" />
            </div>

            {/* Sliding Panels */}
            <div ref={ridePopupPanelRef} className='fixed md:absolute w-full md:w-[450px] md:left-0 z-40 bottom-0 translate-y-full bg-surface border-t border-r border-slate-700 shadow-2xl px-5 py-8 pt-12 md:rounded-tr-2xl text-textMain'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            
            <div ref={confirmRidePopupPanelRef} className='fixed md:absolute w-full md:w-[450px] md:left-0 h-screen md:h-[90vh] z-50 bottom-0 translate-y-full bg-surface border-t border-r border-slate-700 shadow-2xl px-5 py-8 pt-12 md:rounded-tr-2xl text-textMain overflow-y-auto'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome