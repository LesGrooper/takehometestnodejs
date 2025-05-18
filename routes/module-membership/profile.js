const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { BASE_API_URL } = require('../../config');

// get profile
router.get('/profile', async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            error: error.response?.data || error.message,
        });
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/profile`, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Profile error:', error.response?.data || error.message);

        return res.status(error.response?.status || 400).json({
            error: error.response?.data || error.message
        });
    }
});

// update
router.put('/profile/update', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { first_name, last_name } = req.body;

    if (!authHeader) {
        return res.status(401).json({
            error: error.response?.data || error.message,
        });
    }

    try {
        const response = await axios.put(`${BASE_API_URL}/profile/update`, {
            first_name,
            last_name
        }, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Profile error:', error.response?.data || error.message);

        return res.status(error.response?.status || 400).json({
            error: error.response?.data || error.message
        });
    }
});


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only jpeg and png files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });


// POST /profile/image
router.put('/profile/image', upload.any(), async (req, res) => {
    const file = req.files?.[0];
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            status: 401,
            message: 'Authorization token is required'
        });
    }

    if (!file) {
        return res.status(400).json({
            status: 400,
            message: 'No image file uploaded or invalid format (only jpeg/png allowed)'
        });
    }

    try {
        const form = new FormData();
        form.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        });

        const response = await axios.put(`${BASE_API_URL}/profile/image`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: authHeader
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);

        return res.status(error.response?.status || 400).json({
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
