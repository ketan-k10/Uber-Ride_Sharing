import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const Captainlogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = { email, password }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)
      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch(err) { console.log(err) }
    setEmail('')
    setPassword('')
  }

  return (
    <div className='bg-background min-h-screen flex justify-center items-center'>
      <div className='p-7 h-screen sm:h-[800px] sm:max-w-md w-full flex flex-col justify-between bg-surface sm:rounded-2xl sm:shadow-2xl sm:shadow-primary/10 border-slate-700 sm:border'>
        <div>
          <div className='text-3xl font-extrabold tracking-tight text-white drop-shadow-md mb-8 mt-4'>
            Smart<span className="text-primary">-Ride</span> <span className='text-sm text-accent font-normal'>Captain</span>
          </div>

          <form onSubmit={(e) => submitHandler(e)}>
            <h3 className='text-lg font-medium mb-2 text-textMain'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-inputBg text-textMain mb-7 rounded-lg px-4 py-3 border border-slate-600 focus:border-primary focus:outline-none w-full text-lg placeholder:text-textMuted'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2 text-textMain'>Enter Password</h3>
            <input
              className='bg-inputBg text-textMain mb-7 rounded-lg px-4 py-3 border border-slate-600 focus:border-primary focus:outline-none w-full text-lg placeholder:text-textMuted'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required type="password"
              placeholder='password'
            />

            <button
              className='bg-primary hover:bg-primaryHover text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-lg transition'
            >Login</button>
          </form>
          <p className='text-center text-textMuted'>Join a fleet? <Link to='/captain-signup' className='text-primary hover:text-primaryHover transition'>Register as a Captain</Link></p>
        </div>
        <div className='mb-6 sm:mb-0'>
          <Link
            to='/login'
            className='bg-accent hover:bg-[#7c3aed] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-3 w-full text-lg transition'
          >Sign in as User</Link>
        </div>
      </div>
    </div>
  )
}
export default Captainlogin