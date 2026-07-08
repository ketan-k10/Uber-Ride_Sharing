import React, { useRef, useState } from 'react'
import axios from 'axios'
import { blobToWavBase64 } from '../utils/wav'

// A self-contained "Book by voice" control: records the user's request,
// converts it to WAV, sends it to the Gemini-backed endpoint, and hands the
// parsed { pickup, destination, vehicleType } back via onResult.
const VoiceBooking = ({ onResult, onError }) => {
    const [ status, setStatus ] = useState('idle') // idle | recording | processing
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const streamRef = useRef(null)

    const cleanupStream = () => {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
    }

    const startRecording = async () => {
        onError?.('')
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
            onError?.('Voice input is not supported on this browser. Try Chrome.')
            return
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream
            chunksRef.current = []
            const recorder = new MediaRecorder(stream)
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
            recorder.onstop = handleStop
            mediaRecorderRef.current = recorder
            recorder.start()
            setStatus('recording')
        } catch {
            cleanupStream()
            onError?.('Microphone access was blocked. Please allow it and try again.')
        }
    }

    const stopRecording = () => {
        const recorder = mediaRecorderRef.current
        if (recorder && recorder.state !== 'inactive') recorder.stop()
    }

    const handleStop = async () => {
        cleanupStream()
        setStatus('processing')
        try {
            const type = chunksRef.current[0]?.type || 'audio/webm'
            const blob = new Blob(chunksRef.current, { type })
            const audioBase64 = await blobToWavBase64(blob)
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/ai/parse-ride`,
                { audioBase64, mimeType: 'audio/wav' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            setStatus('idle')
            onResult?.(res.data)
        } catch (err) {
            setStatus('idle')
            onError?.(err?.response?.data?.message || 'Could not understand that. Please try again.')
        }
    }

    const toggle = () => {
        if (status === 'recording') stopRecording()
        else if (status === 'idle') startRecording()
    }

    const base = 'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium transition'

    if (status === 'recording') {
        return (
            <button onClick={toggle} className={`${base} bg-primary/10 border border-primary text-primary`}>
                <span className='relative flex h-2.5 w-2.5'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-primary'></span>
                </span>
                Listening… tap to stop
            </button>
        )
    }

    if (status === 'processing') {
        return (
            <button disabled className={`${base} bg-inputBg border border-borderColor text-textMuted`}>
                <span className='h-4 w-4 rounded-full border-2 border-borderColor border-t-primary animate-spin'></span>
                Understanding…
            </button>
        )
    }

    return (
        <button onClick={toggle} className={`${base} bg-inputBg border border-borderColor hover:border-primary text-textMain`}>
            <i className="ri-mic-fill text-primary"></i> Book by voice
        </button>
    )
}

export default VoiceBooking
