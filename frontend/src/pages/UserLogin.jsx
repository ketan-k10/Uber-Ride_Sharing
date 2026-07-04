import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, { email, password })
      if (response.status === 200) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        navigate('/home')
      }
    } catch(err) { console.log(err) }
  }

  return (
    <div className='h-full flex flex-col bg-background px-7 pt-14 pb-10'>
      {/* Brand */}
      <div className='mb-10'>
        <h1 className='text-3xl font-serif font-semibold text-textMain'>Smart<span className='text-primary'>-Ride</span></h1>
      </div>

      <div className='flex-1'>
        <h2 className='text-2xl font-serif font-semibold text-textMain mb-1'>Welcome back</h2>
        <p className='text-textMuted text-sm mb-8 font-light'>Sign in to continue your journey.</p>

        <form onSubmit={submitHandler}>
          <div className='mb-4'>
            <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>Email</label>
            <input
              required value={email} onChange={(e) => setEmail(e.target.value)}
              className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
              type="email" placeholder='hello@example.com'
            />
          </div>
          <div className='mb-8'>
            <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>Password</label>
            <input
              required value={password} onChange={(e) => setPassword(e.target.value)}
              className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
              type="password" placeholder='••••••••'
            />
          </div>
          <button className='w-full bg-primary hover:bg-primaryHover text-white font-medium rounded-2xl py-4 transition shadow-sm mb-4'>
            Sign In
          </button>
        </form>

        <p className='text-center text-sm text-textMuted'>
          New here? <Link to='/signup' className='text-primary font-medium'>Create account</Link>
        </p>
      </div>

      <div className='pt-6 border-t border-borderColor mt-6'>
        <Link to='/captain-login' className='flex items-center justify-center gap-2 text-textMuted bg-white border border-borderColor hover:bg-inputBg font-medium rounded-2xl py-3.5 w-full text-sm transition'>
          <i className="ri-steering-2-line"></i> Sign in as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin