// Converts a recorded audio Blob (e.g. Chrome's webm/opus) into a mono, 16 kHz,
// 16-bit PCM WAV — a format Gemini accepts — returned as a base64 string.
export async function blobToWavBase64(blob) {
    const arrayBuffer = await blob.arrayBuffer()
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const audioCtx = new AudioCtx()
    const decoded = await audioCtx.decodeAudioData(arrayBuffer)
    audioCtx.close()

    const targetRate = 16000
    const mono = downmixToMono(decoded)
    const resampled = resample(mono, decoded.sampleRate, targetRate)
    const wav = encodeWav(resampled, targetRate)
    return arrayBufferToBase64(wav)
}

function downmixToMono(audioBuffer) {
    const channels = audioBuffer.numberOfChannels
    if (channels === 1) return audioBuffer.getChannelData(0)
    const len = audioBuffer.length
    const out = new Float32Array(len)
    for (let c = 0; c < channels; c++) {
        const data = audioBuffer.getChannelData(c)
        for (let i = 0; i < len; i++) out[i] += data[i] / channels
    }
    return out
}

function resample(input, inRate, outRate) {
    if (inRate === outRate) return input
    const ratio = inRate / outRate
    const outLen = Math.round(input.length / ratio)
    const out = new Float32Array(outLen)
    for (let i = 0; i < outLen; i++) {
        const idx = i * ratio
        const i0 = Math.floor(idx)
        const i1 = Math.min(i0 + 1, input.length - 1)
        const frac = idx - i0
        out[i] = input[i0] * (1 - frac) + input[i1] * frac
    }
    return out
}

function encodeWav(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(buffer)
    const writeString = (offset, str) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + samples.length * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)        // PCM chunk size
    view.setUint16(20, 1, true)         // format = PCM
    view.setUint16(22, 1, true)         // channels = mono
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true) // byte rate
    view.setUint16(32, 2, true)         // block align
    view.setUint16(34, 16, true)        // bits per sample
    writeString(36, 'data')
    view.setUint32(40, samples.length * 2, true)

    let offset = 44
    for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]))
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
        offset += 2
    }
    return buffer
}

function arrayBufferToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
    }
    return btoa(binary)
}
