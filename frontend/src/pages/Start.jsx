import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='bg-background h-screen flex justify-center items-center'>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=2000&auto=format&fit=crop)] h-screen sm:h-[800px] w-full sm:max-w-md sm:rounded-2xl sm:shadow-2xl sm:shadow-primary/20 pt-8 flex justify-between flex-col relative overflow-hidden'>
        <div className='ml-8 text-3xl font-extrabold tracking-tight text-white drop-shadow-md'>
          Smart<span className="text-primary">-Ride</span>
        </div>
        <div className='bg-surface/95 backdrop-blur-md pb-8 py-6 px-6 sm:rounded-b-2xl border-t border-slate-700'>
          <h2 className='text-[30px] font-semibold mb-1 text-white'>Get Started with Smart-Ride</h2>
          <p className='text-textMuted mb-5'>Your AI-powered ride companion.</p>
          <Link to='/login' className='flex items-center justify-center w-full bg-primary hover:bg-primaryHover transition flex-grow text-white py-3 rounded-lg mt-2 font-medium'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start