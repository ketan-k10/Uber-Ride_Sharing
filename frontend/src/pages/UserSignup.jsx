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
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch(err) {
      console.log(err)
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
  }

  return (
    <div className='bg-background min-h-screen flex justify-center items-center'>
      <div className='p-7 h-screen sm:h-[800px] sm:max-w-md w-full flex flex-col justify-between bg-surface sm:rounded-2xl sm:shadow-2xl sm:shadow-primary/10 border-slate-700 sm:border'>
        <div>
          <div className='text-3xl font-extrabold tracking-tight text-white drop-shadow-md mb-8 mt-4'>
            Smart<span className="text-primary">-Ride</span>
          </div>

          <form onSubmit={(e) => submitHandler(e)}>
            <h3 className='text-lg w-full font-medium mb-2 text-textMain'>What's your name</h3>
            <div className='flex gap-4 mb-5'>
              <input
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-3 border border-slate-600 focus:border-primary focus:outline-none text-lg placeholder:text-textMuted'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-3 border border-slate-600 focus:border-primary focus:outline-none text-lg placeholder:text-textMuted'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <h3 className='text-lg font-medium mb-2 text-textMain'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-inputBg text-textMain mb-5 rounded-lg px-4 py-3 border border-slate-600 focus:border-primary focus:outline-none w-full text-lg placeholder:text-textMuted'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2 text-textMain'>Enter Password</h3>
            <input
              className='bg-inputBg text-textMain mb-6 rounded-lg px-4 py-3 border border-slate-600 focus:border-primary focus:outline-none w-full text-lg placeholder:text-textMuted'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required type="password"
              placeholder='password'
            />

            <button
              className='bg-primary hover:bg-primaryHover text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-lg transition'
            >Create account</button>

          </form>
          <p className='text-center text-textMuted'>Already have an account? <Link to='/login' className='text-primary hover:text-primaryHover transition'>Login here</Link></p>
        </div>
        <div className='mb-6 sm:mb-0'>
          <p className='text-[10px] text-textMuted leading-tight'>This site is protected by reCAPTCHA and the <span className='underline text-slate-300'>Google Privacy
            Policy</span> and <span className='underline text-slate-300'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div>
  )
}
export default UserSignup