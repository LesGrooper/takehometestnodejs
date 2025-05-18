const express = require('express');
const router = express.Router();
const axios = require('axios');
const { BASE_API_URL } = require('../../config');

// services
router.get('/services', async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: error.response?.data || error.message,
    });
  }

  try {
    const response = await axios.get(`${BASE_API_URL}/services`,
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
