import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const Captainlogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const login = async (credentials) => {
    setError('')
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, credentials)
      if (response.status === 200) {
        setCaptain(response.data.captain)
        localStorage.setItem('token', response.data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    login({ email, password })
  }

  const demoLogin = () => login({ email: 'captain@smartride.com', password: 'demo1234' })

  return (
    <div className='h-full flex flex-col bg-background px-7 pt-14 pb-10'>
      <div className='mb-10'>
        <h1 className='text-3xl font-serif font-semibold text-textMain'>Smart<span className='text-primary'>-Ride</span></h1>
        <p className='text-xs text-textMuted tracking-widest uppercase mt-1'>Captain Portal</p>
      </div>

      <div className='flex-1'>
        <h2 className='text-2xl font-serif font-semibold text-textMain mb-1'>Captain Sign In</h2>
        <p className='text-textMuted text-sm mb-6 font-light'>Manage your rides and earnings.</p>

        {/* Demo login — no credentials needed */}
        <button
          onClick={demoLogin}
          disabled={loading}
          className='w-full flex items-center justify-center gap-2 bg-inputBg border border-borderColor hover:border-primary text-textMain font-medium rounded-2xl py-3.5 mb-5 text-sm transition disabled:opacity-60'
        >
          <i className="ri-flashlight-line text-primary"></i> Try demo as Captain
        </button>

        <div className='flex items-center gap-3 mb-5'>
          <div className='h-px bg-borderColor flex-1'></div>
          <span className='text-xs text-textMuted'>or sign in</span>
          <div className='h-px bg-borderColor flex-1'></div>
        </div>

        {error && (
          <div className='mb-4 text-sm text-primary bg-primary/10 border border-primary/20 rounded-xl px-4 py-3'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className='mb-4'>
            <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>Email</label>
            <input required value={email} onChange={(e) => setEmail(e.target.value)}
              className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
              type="email" placeholder='captain@example.com' />
          </div>
          <div className='mb-8'>
            <label className='block text-xs font-medium uppercase tracking-widest text-textMuted mb-2'>Password</label>
            <input required value={password} onChange={(e) => setPassword(e.target.value)}
              className='bg-inputBg text-textMain rounded-xl px-4 py-3.5 border border-borderColor focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none w-full text-sm placeholder:text-textMuted/50 transition'
              type="password" placeholder='••••••••' />
          </div>
          <button
            disabled={loading}
            className='w-full bg-primary hover:bg-primaryHover text-white font-medium rounded-2xl py-4 transition shadow-sm mb-4 disabled:opacity-70'
          >
            {loading ? 'Signing in…' : 'Sign In as Captain'}
          </button>
        </form>

        <p className='text-center text-sm text-textMuted'>
          New captain? <Link to='/captain-signup' className='text-primary font-medium'>Register</Link>
        </p>
      </div>

      <div className='pt-6 border-t border-borderColor mt-6'>
        <Link to='/login' className='flex items-center justify-center gap-2 text-textMuted bg-white border border-borderColor hover:bg-inputBg font-medium rounded-2xl py-3.5 w-full text-sm transition'>
          <i className="ri-user-3-line"></i> Sign in as Rider
        </Link>
      </div>
    </div>
  )
}

export default Captainlogin
