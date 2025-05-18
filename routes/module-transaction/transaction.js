const express = require('express');
const router = express.Router();
const axios = require('axios');
const { BASE_API_URL } = require('../../config');

// transaction
router.post('/transaction', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { service_code } = req.body;

    if (!authHeader) {
        return res.status(401).json({
            error: error.response?.data || error.message,
        });
    }

    try {
        const response = await axios.post(`${BASE_API_URL}/transaction`,
            {
                service_code
            },
            {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
});

// transaction/history
router.get('/transaction/history', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const limit = req.query['limit'];
    const offset = req.query['offset'];

    if (!authHeader) {
        return res.status(401).json({
            error: error.response?.data || error.message,
        });
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/transaction/history`,
            {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                    'limit'        : limit,
                    'offset'        : offset
                },
                params: {
                    limit,
                    offset
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
});

module.exports = router;
