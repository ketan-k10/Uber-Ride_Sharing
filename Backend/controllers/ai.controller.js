const aiService = require('../services/ai.service');
const { validationResult } = require('express-validator');

module.exports.parseRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { audioBase64, mimeType } = req.body;
    const intent = await aiService.parseRideFromAudio(audioBase64, mimeType);
    res.status(200).json(intent);
};
