import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, {
        fullname: { firstname: firstName, lastname: lastName },
        email, password
      })
      if (response.status === 201) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        navigate('/home')
      }
    } catch(err) { console.log(err) }
  }

  return (
    <div className='min-h-full flex flex-col bg-background px-7 pt-14 pb-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-serif font-semibold text-textMain'>Smart<span className='text-primary'>-Ride</span></h1>
      </div>

      <h2 className='text-2xl font-serif font-semibold text-textMain mb-1'>Create Account</h2>
      <p className='text-textMuted text-sm mb-8 font-light'>Join our intelligent transit network.</p>

      <form onSubmit={submitHandler} className='flex-1'>
        <div className='flex gap-3 mb-4'>
          <div className='flex-1'>
            <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>First Name</label>
            <input required value={firstName} onChange={(e) => setFirstName(e.target.value)}
              className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
              type="text" placeholder='Jane' />
          </div>
          <div className='flex-1'>
            <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>Last Name</label>
            <input required value={lastName} onChange={(e) => setLastName(e.target.value)}
              className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
              type="text" placeholder='Doe' />
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>Email</label>
          <input required value={email} onChange={(e) => setEmail(e.target.value)}
            className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
            type="email" placeholder='hello@example.com' />
        </div>

        <div className='mb-8'>
          <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>Password</label>
          <input required value={password} onChange={(e) => setPassword(e.target.value)}
            className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
            type="password" placeholder='••••••••' />
        </div>

        <button className='w-full bg-primary hover:bg-primaryHover text-white font-medium rounded-2xl py-4 transition shadow-sm mb-4'>
          Create Account
        </button>
      </form>

      <p className='text-center text-sm text-textMuted mt-4'>
        Already a member? <Link to='/login' className='text-primary font-medium'>Sign in</Link>
      </p>
    </div>
  )
}

export default UserSignup