import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainSignup = () => {
  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email: email,
      password: password,
      vehicle: { color: vehicleColor, plate: vehiclePlate, capacity: vehicleCapacity, vehicleType: vehicleType }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch(err) { console.log(err) }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }

  return (
    <div className='bg-background min-h-screen flex justify-center items-center'>
      <div className='py-5 px-5 h-screen sm:h-auto sm:py-8 sm:min-h-[850px] sm:max-w-md w-full flex flex-col justify-between bg-surface sm:rounded-2xl sm:shadow-2xl sm:shadow-primary/10 border-slate-700 sm:border overflow-y-auto'>
        <div>
          <div className='text-3xl font-extrabold tracking-tight text-white drop-shadow-md mb-8 mt-2'>
            Smart<span className="text-primary">-Ride</span> <span className='text-sm text-accent font-normal'>Captain</span>
          </div>

          <form onSubmit={(e) => submitHandler(e)}>
            <h3 className='text-lg w-full font-medium mb-2 text-textMain'>Captain's Name</h3>
            <div className='flex gap-4 mb-5'>
              <input
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none text-base placeholder:text-textMuted'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none text-base placeholder:text-textMuted'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <h3 className='text-lg font-medium mb-2 text-textMain'>Captain's Email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-inputBg text-textMain mb-5 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none w-full text-base placeholder:text-textMuted'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2 text-textMain'>Password</h3>
            <input
              className='bg-inputBg text-textMain mb-5 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none w-full text-base placeholder:text-textMuted'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required type="password"
              placeholder='password'
            />

            <h3 className='text-lg font-medium mb-2 text-textMain'>Vehicle Information</h3>
            <div className='flex gap-4 mb-5'>
              <input
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none text-base placeholder:text-textMuted'
                type="text"
                placeholder='Vehicle Color'
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
              />
              <input
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none text-base placeholder:text-textMuted'
                type="text"
                placeholder='Vehicle Plate'
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
              />
            </div>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none text-base placeholder:text-textMuted'
                type="number"
                placeholder='Capacity'
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
              />
              <select
                required
                className='bg-inputBg text-textMain w-1/2 rounded-lg px-4 py-2 border border-slate-600 focus:border-primary focus:outline-none text-base'
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="" disabled>Select Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
            </div>

            <button
              className='bg-primary hover:bg-primaryHover text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-lg transition'
            >Create Captain Account</button>
          </form>
          <p className='text-center text-textMuted'>Already have an account? <Link to='/captain-login' className='text-primary hover:text-primaryHover transition'>Login here</Link></p>
        </div>
        <div className='mb-6 sm:mb-0'>
          <p className='text-[10px] mt-6 text-textMuted leading-tight'>This site is protected by reCAPTCHA and the <span className='underline text-slate-300'>Google Privacy Policy</span> and <span className='underline text-slate-300'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div>
  )
}
export default CaptainSignup