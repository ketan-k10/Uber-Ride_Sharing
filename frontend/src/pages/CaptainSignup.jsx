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
  const { setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, {
        fullname: { firstname: firstName, lastname: lastName },
        email, password,
        vehicle: { color: vehicleColor, plate: vehiclePlate, capacity: vehicleCapacity, vehicleType }
      })
      if (response.status === 201) {
        setCaptain(response.data.captain)
        localStorage.setItem('token', response.data.token)
        navigate('/captain-home')
      }
    } catch(err) { console.log(err) }
  }

  const inputClass = 'bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
  const labelClass = 'block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'

  return (
    <div className='min-h-full flex flex-col bg-background px-7 pt-14 pb-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-serif font-semibold text-textMain'>Smart<span className='text-primary'>-Ride</span></h1>
        <p className='text-xs text-textMuted tracking-widest uppercase mt-1'>Captain Portal</p>
      </div>

      <h2 className='text-2xl font-serif font-semibold text-textMain mb-1'>Register Fleet</h2>
      <p className='text-textMuted text-sm mb-8 font-light'>Join as a Smart-Ride captain.</p>

      <form onSubmit={submitHandler}>
        {/* Personal */}
        <p className={labelClass}>Full Name</p>
        <div className='flex gap-3 mb-4'>
          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} type="text" placeholder='First' />
          <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} type="text" placeholder='Last' />
        </div>
        <div className='mb-4'>
          <label className={labelClass}>Email</label>
          <input required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} type="email" placeholder='captain@example.com' />
        </div>
        <div className='mb-7'>
          <label className={labelClass}>Password</label>
          <input required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} type="password" placeholder='••••••••' />
        </div>

        {/* Vehicle */}
        <div className='border-t border-borderColor pt-6 mb-4'>
          <p className={labelClass}>Vehicle Details</p>
          <div className='flex gap-3'>
            <input required value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} className={inputClass} type="text" placeholder='Color' />
            <input required value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className={inputClass} type="text" placeholder='Plate No.' />
          </div>
        </div>
        <div className='flex gap-3 mb-8'>
          <input required value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} className={inputClass} type="number" placeholder='Seats' />
          <select required value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={inputClass}>
            <option value="" disabled>Type</option>
            <option value="car">Car</option>
            <option value="auto">Auto</option>
            <option value="moto">Moto</option>
          </select>
        </div>

        <button className='w-full bg-primary hover:bg-primaryHover text-white font-medium rounded-2xl py-4 transition shadow-sm mb-4'>
          Register as Captain
        </button>
      </form>

      <p className='text-center text-sm text-textMuted'>
        Already a captain? <Link to='/captain-login' className='text-primary font-medium'>Sign in</Link>
      </p>
    </div>
  )
}

export default CaptainSignup