import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='h-full flex flex-col bg-background'>

      {/* Hero Image — top 55% */}
      <div className='relative flex-shrink-0' style={{ height: '55%' }}>
        <img
          src="/landing.png"
          alt="Smart-Ride"
          className='w-full h-full object-cover'
        />
        {/* Gradient fade into bottom card */}
        <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent'></div>
      </div>

      {/* Bottom content card */}
      <div className='flex flex-col flex-1 px-7 pt-2 pb-10 bg-background'>

        {/* Branding */}
        <div className='mb-5'>
          <h1 className='text-4xl font-serif font-semibold text-textMain leading-tight'>
            Smart<span className='text-primary'>-Ride</span>
          </h1>
          <p className='text-xs text-textMuted tracking-[0.2em] uppercase mt-1'>Intelligent Transit</p>
        </div>

        {/* Tagline */}
        <h2 className='text-xl font-serif leading-snug text-textMain mb-3'>
          A journey designed around you.
        </h2>
        <p className='text-sm text-textMuted font-light leading-relaxed mb-8'>
          Effortless travel with intelligent scheduling. Step into the future of serene commuting.
        </p>

        {/* CTAs */}
        <Link
          to='/login'
          className='w-full bg-primary hover:bg-primaryHover text-white text-center py-4 rounded-2xl font-medium tracking-wide transition shadow-sm mb-3'
        >
          Get Started
        </Link>
        <Link
          to='/captain-login'
          className='w-full bg-white border border-borderColor hover:bg-inputBg text-textMain text-center py-4 rounded-2xl font-medium transition text-sm'
        >
          Join as Captain
        </Link>
      </div>
    </div>
  )
}

export default Start