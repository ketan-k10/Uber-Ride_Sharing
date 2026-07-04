import React, { useEffect, useState, useContext } from 'react'
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

    // Register socket listeners once (with cleanup) instead of on every render
    useEffect(() => {
        const onConfirmed = (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        }
        const onStarted = (ride) => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        }
        socket.on('ride-confirmed', onConfirmed)
        socket.on('ride-started', onStarted)
        return () => {
            socket.off('ride-confirmed', onConfirmed)
            socket.off('ride-started', onStarted)
        }
    }, [ socket, navigate ])

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

    async function findTrip() {
        if (!pickup || !destination) return
        setPanelOpen(false)
        setVehiclePanel(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setFare(res.data)
        } catch {
            // leave the vehicle panel open; fares just show as blank
        }
    }

    async function createRide() {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, { pickup, destination, vehicleType }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
    }

    const bothSelected = Boolean(pickup && destination)
    const anyPanelOpen = vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver

    return (
        /* Full height of the phone frame */
        <div className='h-full relative overflow-hidden bg-background'>

            {/* ── Map fills the whole area ── */}
            <div className='absolute inset-0'>
                <LiveTracking />
            </div>

            {/* ── Top bar: brand + exit, aligned on one row ── */}
            <div className='absolute top-5 left-5 right-5 z-20 flex items-center justify-between'>
                <div className='px-4 py-2 bg-surface/90 backdrop-blur-md rounded-2xl border border-borderColor shadow-sm'>
                    <span className="text-base font-serif font-semibold text-textMain">
                        Smart<span className="text-primary">-Ride</span>
                    </span>
                </div>
                <button
                    onClick={() => navigate('/user/logout')}
                    title='Log out'
                    className='h-10 w-10 flex items-center justify-center bg-surface/90 backdrop-blur-md rounded-full border border-borderColor shadow-sm text-textMain hover:bg-inputBg transition'
                >
                    <i className="ri-logout-box-r-line"></i>
                </button>
            </div>

            {/* ── Bottom search card — slides out of view while a step panel is open ── */}
            <div className={`absolute bottom-0 left-0 right-0 z-20 bg-surface rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-borderColor transition-transform duration-300 ${anyPanelOpen ? 'translate-y-full' : 'translate-y-0'}`}>

                {/* Drag handle */}
                <div className='flex justify-center pt-3 pb-1'>
                    <div className='w-10 h-1 bg-borderColor rounded-full'></div>
                </div>

                <div className='px-5 pb-5 pt-2'>
                    <h3 className='text-xl font-serif font-semibold text-textMain mb-4'>Where to?</h3>

                    <div className='space-y-2 mb-4'>
                        <div className={`flex items-center gap-3 bg-inputBg border rounded-xl px-4 py-3 transition ${activeField === 'pickup' ? 'border-primary' : 'border-borderColor'}`}>
                            <i className="ri-record-circle-line text-primary text-sm flex-shrink-0"></i>
                            <input
                                className='flex-1 bg-transparent text-textMain text-sm placeholder:text-textMuted focus:outline-none'
                                type="text" placeholder='Pickup location'
                                value={pickup}
                                onClick={() => { setPanelOpen(true); setActiveField('pickup') }}
                                onChange={handlePickupChange}
                            />
                            {pickup && <i className="ri-checkbox-circle-fill text-primary text-base flex-shrink-0"></i>}
                        </div>
                        <div className={`flex items-center gap-3 bg-inputBg border rounded-xl px-4 py-3 transition ${activeField === 'destination' ? 'border-primary' : 'border-borderColor'}`}>
                            <i className="ri-map-pin-2-fill text-textMuted text-sm flex-shrink-0"></i>
                            <input
                                className='flex-1 bg-transparent text-textMain text-sm placeholder:text-textMuted focus:outline-none'
                                type="text" placeholder='Where are you going?'
                                value={destination}
                                onClick={() => { setPanelOpen(true); setActiveField('destination') }}
                                onChange={handleDestinationChange}
                            />
                            {destination && <i className="ri-checkbox-circle-fill text-primary text-base flex-shrink-0"></i>}
                        </div>
                    </div>

                    {/* Suggestions — collapses reliably via max-height, no JS timing */}
                    <div className={`overflow-y-auto transition-all duration-300 ${panelOpen ? 'max-h-[38vh] opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                            setPanelOpen={setPanelOpen}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                            setActiveField={setActiveField}
                        />
                    </div>

                    <button
                        onClick={findTrip}
                        disabled={!bothSelected}
                        className={`w-full font-medium py-4 rounded-2xl transition shadow-sm text-sm ${bothSelected ? 'bg-primary hover:bg-primaryHover text-white' : 'bg-inputBg text-textMuted cursor-not-allowed'}`}
                    >
                        {bothSelected ? 'Search Rides' : 'Enter pickup & destination'}
                    </button>
                </div>
            </div>

            {/* ── Step panels: each hidden below the frame until its state is true ── */}
            <div className={`absolute bottom-0 left-0 right-0 z-30 bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto transition-transform duration-300 ${vehiclePanel ? 'translate-y-0' : 'translate-y-full'}`}>
                <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>

            <div className={`absolute bottom-0 left-0 right-0 z-30 bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto transition-transform duration-300 ${confirmRidePanel ? 'translate-y-0' : 'translate-y-full'}`}>
                <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} setVehicleFound={setVehicleFound} />
            </div>

            <div className={`absolute bottom-0 left-0 right-0 z-30 bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto transition-transform duration-300 ${vehicleFound ? 'translate-y-0' : 'translate-y-full'}`}>
                <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
            </div>

            <div className={`absolute bottom-0 left-0 right-0 z-30 bg-surface rounded-t-3xl shadow-2xl border-t border-borderColor px-5 py-5 pt-8 max-h-[85%] overflow-y-auto transition-transform duration-300 ${waitingForDriver ? 'translate-y-0' : 'translate-y-full'}`}>
                <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home
