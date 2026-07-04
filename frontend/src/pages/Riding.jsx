import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    socket.on("ride-ended", () => {
        navigate('/home')
    })

    return (
        <div className='h-screen flex flex-col md:flex-row relative overflow-hidden bg-background text-textMain'>
            
            <div className='flex flex-col h-screen absolute md:relative top-0 w-full md:w-[450px] z-20 pointer-events-none md:pointer-events-auto'>
                
                <Link to='/home' className='fixed md:absolute right-4 md:right-auto md:left-4 top-4 h-11 w-11 bg-surface border border-slate-700 flex items-center justify-center rounded-full z-30 shadow-lg hover:bg-slate-700 transition pointer-events-auto'>
                    <i className="text-xl font-medium ri-home-5-line text-white"></i>
                </Link>

                <div className='h-1/2 md:h-full w-full bg-surface shadow-[0_-5px_20px_rgba(0,0,0,0.5)] md:shadow-2xl relative pointer-events-auto md:border-r border-slate-700 mt-auto md:pt-24 p-6 flex flex-col justify-between'>
                    <div>
                        <div className='flex items-center justify-between mb-6'>
                            <img className='h-12 drop-shadow-md' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Car" />
                            <div className='text-right'>
                                <h2 className='text-lg font-medium capitalize text-textMain'>{ride?.captain.fullname.firstname}</h2>
                                <h4 className='text-xl font-semibold text-white -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                                <p className='text-sm text-textMuted'>Maruti Suzuki Alto</p>
                            </div>
                        </div>

                        <div className='flex gap-2 justify-between flex-col items-center bg-inputBg rounded-xl p-2'>
                            <div className='w-full'>
                                <div className='flex items-center gap-5 p-3 border-b border-slate-700'>
                                    <i className="text-lg ri-map-pin-2-fill text-primary"></i>
                                    <div>
                                        <h3 className='text-lg font-medium text-textMain'>Destination</h3>
                                        <p className='text-sm text-textMuted'>{ride?.destination}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 p-3'>
                                    <i className="ri-currency-line text-green-500"></i>
                                    <div>
                                        <h3 className='text-lg font-medium text-textMain'>₹{ride?.fare} </h3>
                                        <p className='text-sm text-textMuted'>Cash</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button className='w-full mt-5 bg-primary hover:bg-primaryHover text-white font-semibold p-3 rounded-xl transition text-lg shadow-lg shadow-primary/20'>
                        Make a Payment
                    </button>
                </div>
            </div>

            <div className='h-1/2 md:h-full w-full md:flex-1 absolute md:relative z-10 top-0 left-0 bg-background'>
                <LiveTracking />
            </div>
            
        </div>
    )
}

export default Riding