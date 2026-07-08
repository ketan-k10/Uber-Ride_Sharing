const axios = require('axios');

// Model is configurable so it can be bumped (e.g. gemini-3.1-pro) without a code change.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

const PROMPT = `You are the voice assistant for "Smart-Ride", a ride-hailing app.
The user has just spoken a request to book a ride. Listen to the audio and extract:
- pickup: the pickup / starting location they mention (empty string if they don't state one)
- destination: where they want to go (empty string if they don't state one)
- vehicleType: one of "car", "moto", or "auto".
    "moto" = bike / motorcycle, "auto" = auto-rickshaw / tuk-tuk, "car" = car / cab / taxi.
    If the user does not specify a vehicle, use "car".
Only extract locations the user actually says — never invent place names.`;

// Gemini REST responseSchema (OpenAPI subset, UPPERCASE types)
const responseSchema = {
    type: 'OBJECT',
    properties: {
        pickup: { type: 'STRING' },
        destination: { type: 'STRING' },
        vehicleType: { type: 'STRING', enum: [ 'car', 'moto', 'auto' ] },
    },
    required: [ 'pickup', 'destination', 'vehicleType' ],
};

// Sends recorded audio to Gemini and returns { pickup, destination, vehicleType }.
module.exports.parseRideFromAudio = async (audioBase64, mimeType = 'audio/wav') => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        const err = new Error('Voice booking is not configured (missing GEMINI_API_KEY).');
        err.status = 503;
        throw err;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const body = {
        contents: [ {
            parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType, data: audioBase64 } },
            ],
        } ],
        generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
        },
    };

    const { data } = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
    });

    const text = data?.candidates?.[ 0 ]?.content?.parts?.[ 0 ]?.text;
    if (!text) {
        const err = new Error('The assistant could not understand the audio. Please try again.');
        err.status = 502;
        throw err;
    }

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch {
        const err = new Error('The assistant returned an unexpected response. Please try again.');
        err.status = 502;
        throw err;
    }

    return {
        pickup: (parsed.pickup || '').trim(),
        destination: (parsed.destination || '').trim(),
        vehicleType: [ 'car', 'moto', 'auto' ].includes(parsed.vehicleType) ? parsed.vehicleType : 'car',
    };
};
