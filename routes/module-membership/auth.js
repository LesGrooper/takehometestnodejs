const express = require('express');
const router = express.Router();
const axios = require('axios');
const { BASE_API_URL } = require('../../config');

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: error.response?.data || error.message
        });
    }

    try {
        const response = await axios.post(`${BASE_API_URL}/login`, {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Forward response dari external API ke Postman
        return res.status(200).json(response.data);
    } catch (error) {
        // Kirim error dari API eksternal (kalau ada)
        return res.status(error.response?.status || 401).json({error: error.response?.data || error.message});
    }
});

// register
router.post('/registration', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
            status: 104,
            message: "Parameter input tidak lengkap",
            data: null
        });
    }

    try {
        const response = await axios.post(`${BASE_API_URL}/registration`, {
            email,
            password,
            first_name,
            last_name
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);

        return res.status(error.response?.status || 400).json({
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
