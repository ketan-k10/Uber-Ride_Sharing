const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const aiController = require('../controllers/ai.controller');

router.post('/parse-ride',
    authMiddleware.authUser,
    body('audioBase64').isString().isLength({ min: 100 }).withMessage('Missing or invalid audio'),
    aiController.parseRide
);

module.exports = router;
