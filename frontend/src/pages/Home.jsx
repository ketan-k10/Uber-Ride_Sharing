import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
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
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setPickupSuggestions(res.data)
        } catch {}
    }
    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setDestinationSuggestions(res.data)
        } catch {}
    }

    // GSAP — suggestion panel
    useGSAP(() => {
        if (panelOpen) gsap.to(panelRef.current, { height: '40%', opacity: 1, duration: 0.3 })
        else gsap.to(panelRef.current, { height: '0%', opacity: 0, duration: 0.2 })
    }, [ panelOpen ])

    // GSAP — sliding panels
    useGSAP(() => { gsap.to(vehiclePanelRef.current, { transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)', duration: 0.35 }) }, [ vehiclePanel ])
    useGSAP(() => { gsap.to(confirmRidePanelRef.current, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)', duration: 0.35 }) }, [ confirmRidePanel ])
    useGSAP(() => { gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)', duration: 0.35 }) }, [ vehicleFound ])
    useGSAP(() => { gsap.to(waitingForDriverRef.current, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)', duration: 0.35 }) }, [ waitingForDriver ])

    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setFare(res.data)
    }

    async function createRide() {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, { pickup, destination, vehicleType }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
    }

    return (
        /* Full height of the phone frame */
        <div className='h-full relative overflow-hidden bg-background'>

            {/* ── Map fills top portion ── */}
            <div className='absolute inset-0'>
                <LiveTracking />
            </div>

            {/* ── Brand pill overlay ── */}
            <div className='absolute top-5 left-5 z-20 px-4 py-2 bg-surface/90 backdrop-blur-md rounded-2xl border border-borderColor shadow-sm'>
                <span className="text-base font-serif font-semibold text-textMain">
                    Smart<span className="text-primary">-Ride</span>
                </span>
            </div>

            {/* ── Bottom search card ── */}
            <div className='absolute bottom-0 left-0 right-0 z-20 bg-surface rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-borderColor'>

                {/* Drag handle */}
                <div className='flex justify-center pt-3 pb-1'>
                    <div className='w-10 h-1 bg-borderColor rounded-full'></div>
                </div>

                <div className='px-5 pb-5 pt-2'>
                    <h3 className='text-xl font-serif font-semibold text-textMain mb-4'>Where to?</h3>

                    <div className='space-y-2 mb-4'>
                        <div className='flex items-center gap-3 bg-inputBg border border-borderColor rounded-xl px-4 py-3'>
                            <i className="ri-record-circle-line text-primary text-sm flex-shrink-0"></i>
                            <input
                                className='flex-1 bg-transparent text-textMain text-sm placeholder:text-textMuted focus:outline-none'
                                type="text" placeholder='Pickup location'
                                value={pickup}
                                onClick={() => { setPanelOpen(true); setActiveField('pickup') }}
                                onChange={handlePickupChange}
                            />
                        </div>
                        <div className='flex items-center gap-3 bg-inputBg border border-borderColor rounded-xl px-4 py-3'>
                            <i className="ri-map-pin-2-fill text-textMuted text-sm flex-shrink-0"></i>
                            <input
                                className='flex-1 bg-transparent text-textMain text-sm placeholder:text-textMuted focus:outline-none'
                                type="text" placeholder='Where are you going?'
                                value={destination}
                                onClick={() => { setPanelOpen(true); setActiveField('destination') }}
                                onChange={handleDestinationChange}
                            />
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div ref={panelRef} className='overflow-y-auto h-0 opacity-0'>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                            setPanelOpen={setPanelOpen}
                            setVehiclePanel={setVehiclePanel}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                        />
                    </div>

                    <button onClick={findTrip}
                        className='w-full bg-primary hover:bg-primaryHover text-white font-medium py-4 rounded-2xl transition shadow-sm text-sm'>
                        Search Rides
                    </button>
                </div>
            </div>

            {/* ── Slide-up panels (absolute within phone frame) ── */}
            <div ref={vehiclePanelRef} className='absolute bottom-0 left-0 right-0 z-30 translate-y-full bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto'>
                <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>

            <div ref={confirmRidePanelRef} className='absolute bottom-0 left-0 right-0 z-30 translate-y-full bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto'>
                <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>

            <div ref={vehicleFoundRef} className='absolute bottom-0 left-0 right-0 z-30 translate-y-full bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto'>
                <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
            </div>

            <div ref={waitingForDriverRef} className='absolute bottom-0 left-0 right-0 z-30 translate-y-full bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto'>
                <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home