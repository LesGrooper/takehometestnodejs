const express = require('express');
const router = express.Router();
const axios = require('axios');
const { BASE_API_URL } = require('../../config');

// topup
router.post('/topup', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { top_up_amount } = req.body;

    if (!authHeader) {
        return res.status(401).json({
            error: error.response?.data || error.message,
        });
    }

    try {
        const response = await axios.post(`${BASE_API_URL}/topup`,
            {
                top_up_amount
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

module.exports = router;
