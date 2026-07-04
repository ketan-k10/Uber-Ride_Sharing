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
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch(err) {
      console.log(err)
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='bg-background min-h-screen flex justify-center items-center'>
      <div className='p-7 h-screen sm:h-[800px] sm:max-w-md w-full flex flex-col justify-between bg-surface sm:rounded-2xl sm:shadow-2xl sm:shadow-primary/10 border-slate-700 sm:border'>
        <div>
          <div className='text-3xl font-extrabold tracking-tight text-white drop-shadow-md mb-8 mt-4'>
            Smart<span className="text-primary">-Ride</span>
          </div>

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
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
          <p className='text-center text-textMuted'>New here? <Link to='/signup' className='text-primary hover:text-primaryHover transition'>Create new Account</Link></p>
        </div>
        <div className='mb-6 sm:mb-0'>
          <Link
            to='/captain-login'
            className='bg-accent hover:bg-[#7c3aed] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-3 w-full text-lg transition'
          >Sign in as Captain</Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin