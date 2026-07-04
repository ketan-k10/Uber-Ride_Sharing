import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import Avatar from '../components/Avatar'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    socket.on("ride-ended", () => navigate('/home'))

    return (
        <div className='h-full relative overflow-hidden bg-background flex flex-col'>

            {/* Map — top half */}
            <div className='flex-1 relative'>
                <LiveTracking />
                <Link to='/home' className='absolute top-5 right-4 h-10 w-10 bg-surface/90 backdrop-blur-md border border-borderColor flex items-center justify-center rounded-full shadow-sm z-10'>
                    <i className="ri-home-5-line text-textMain"></i>
                </Link>
            </div>

            {/* Ride info card — bottom */}
            <div className='bg-surface border-t border-borderColor px-5 py-5 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)]'>
                <div className='flex justify-center mb-4'>
                    <div className='w-10 h-1 bg-borderColor rounded-full'></div>
                </div>

                {/* Captain info */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-11 w-11 rounded-full object-cover border border-borderColor' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" />
                        <div>
                            <h4 className='text-base font-semibold text-textMain capitalize'>{ride?.captain.fullname.firstname}</h4>
                            <p className='text-xs text-textMuted'>{ride?.captain.vehicle.plate}</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <span className='text-lg font-serif font-semibold text-textMain'>₹{ride?.fare}</span>
                        <p className='text-xs text-textMuted'>Cash</p>
                    </div>
                </div>

                {/* Route row */}
                <div className='bg-inputBg border border-borderColor rounded-xl px-4 py-3 mb-4 flex items-center gap-3'>
                    <i className="ri-map-pin-2-fill text-primary text-sm"></i>
                    <p className='text-sm text-textMain truncate'>{ride?.destination}</p>
                </div>

                <button className='w-full bg-primary hover:bg-primaryHover text-white font-medium py-4 rounded-2xl transition shadow-sm text-sm'>
                    Make a Payment
                </button>
            </div>
        </div>
    )
}

export default Riding