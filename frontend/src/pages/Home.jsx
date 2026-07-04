import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } })
    })

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setPickupSuggestions(response.data)
        } catch {}
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setDestinationSuggestions(response.data)
        } catch {}
    }

    const submitHandler = (e) => { e.preventDefault() }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, { height: '70%', padding: 24 })
            gsap.to(panelCloseRef.current, { opacity: 1 })
        } else {
            gsap.to(panelRef.current, { height: '0%', padding: 0 })
            gsap.to(panelCloseRef.current, { opacity: 0 })
        }
    }, [ panelOpen ])

    useGSAP(function () {
        if (vehiclePanel) { gsap.to(vehiclePanelRef.current, { transform: 'translateY(0)' }) } 
        else { gsap.to(vehiclePanelRef.current, { transform: 'translateY(100%)' }) }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) { gsap.to(confirmRidePanelRef.current, { transform: 'translateY(0)' }) } 
        else { gsap.to(confirmRidePanelRef.current, { transform: 'translateY(100%)' }) }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) { gsap.to(vehicleFoundRef.current, { transform: 'translateY(0)' }) } 
        else { gsap.to(vehicleFoundRef.current, { transform: 'translateY(100%)' }) }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) { gsap.to(waitingForDriverRef.current, { transform: 'translateY(0)' }) } 
        else { gsap.to(waitingForDriverRef.current, { transform: 'translateY(100%)' }) }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setFare(response.data)
    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
    }

    return (
        <div className='h-screen flex md:flex-row relative overflow-hidden bg-background text-textMain'>
            
            {/* Navigation & Panels Container (Acts as Sidebar on Desktop) */}
            <div className='flex flex-col justify-end md:justify-start h-screen absolute md:relative top-0 left-0 w-full md:w-[450px] z-20 pointer-events-none md:pointer-events-auto'>
                <div className='h-[30%] md:h-auto md:flex-grow flex flex-col bg-surface shadow-[0_-5px_20px_rgba(0,0,0,0.5)] md:shadow-2xl relative pointer-events-auto md:border-r border-slate-700'>
                    
                    {/* Fixed Top Brand on Desktop, hidden on mobile since it's at the bottom */}
                    <div className='hidden md:block p-6 pb-2'>
                        <h4 className='text-3xl font-extrabold tracking-tight text-white drop-shadow-md'>
                            Smart<span className="text-primary">-Ride</span>
                        </h4>
                    </div>

                    <h5 ref={panelCloseRef} onClick={() => { setPanelOpen(false) }} className='absolute opacity-0 right-6 top-6 text-2xl text-textMain cursor-pointer md:block'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    
                    <div className='p-6 pt-4'>
                        <h4 className='text-2xl font-semibold mb-4 text-white'>Find a trip</h4>
                        <form className='relative py-3' onSubmit={(e) => submitHandler(e)}>
                            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-primary rounded-full md:block"></div>
                            <input
                                onClick={() => { setPanelOpen(true); setActiveField('pickup') }}
                                value={pickup}
                                onChange={handlePickupChange}
                                className='bg-inputBg text-textMain px-12 py-3 text-lg rounded-lg w-full border border-slate-600 focus:border-primary focus:outline-none placeholder:text-textMuted'
                                type="text"
                                placeholder='Add a pick-up location'
                            />
                            <input
                                onClick={() => { setPanelOpen(true); setActiveField('destination') }}
                                value={destination}
                                onChange={handleDestinationChange}
                                className='bg-inputBg text-textMain px-12 py-3 text-lg rounded-lg w-full mt-4 border border-slate-600 focus:border-primary focus:outline-none placeholder:text-textMuted'
                                type="text"
                                placeholder='Enter your destination' />
                        </form>
                        <button
                            onClick={findTrip}
                            className='bg-primary hover:bg-primaryHover transition text-white px-4 py-3 rounded-lg mt-3 w-full font-semibold text-lg'>
                            Search Rides
                        </button>
                    </div>

                    <div ref={panelRef} className='bg-surface h-0 overflow-hidden text-textMain px-2'>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                            setPanelOpen={setPanelOpen}
                            setVehiclePanel={setVehiclePanel}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                        />
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className='h-screen w-full md:flex-1 absolute md:relative z-10 top-0 left-0 bg-background'>
                 {/* Mobile Brand Overlay */}
                <div className='md:hidden absolute top-5 left-5 z-20 text-2xl font-extrabold tracking-tight text-white drop-shadow-md bg-surface/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 pointer-events-auto'>
                    Smart<span className="text-primary">-Ride</span>
                </div>
                <LiveTracking />
            </div>

            {/* Sliding Panels - Restricted to 450px on desktop */}
            <div ref={vehiclePanelRef} className='fixed md:absolute w-full md:w-[450px] md:left-0 z-30 bottom-0 translate-y-full bg-surface border-t border-r border-slate-700 shadow-2xl px-5 py-8 pt-12 md:rounded-tr-2xl text-textMain'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            
            <div ref={confirmRidePanelRef} className='fixed md:absolute w-full md:w-[450px] md:left-0 z-30 bottom-0 translate-y-full bg-surface border-t border-r border-slate-700 shadow-2xl px-5 py-8 pt-12 md:rounded-tr-2xl text-textMain'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>
            
            <div ref={vehicleFoundRef} className='fixed md:absolute w-full md:w-[450px] md:left-0 z-30 bottom-0 translate-y-full bg-surface border-t border-r border-slate-700 shadow-2xl px-5 py-8 pt-12 md:rounded-tr-2xl text-textMain'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            
            <div ref={waitingForDriverRef} className='fixed md:absolute w-full md:w-[450px] md:left-0 z-30 bottom-0 bg-surface border-t border-r border-slate-700 shadow-2xl px-5 py-8 pt-12 md:rounded-tr-2xl text-textMain'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home