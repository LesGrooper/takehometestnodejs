const express = require('express');
const router = express.Router();
const axios = require('axios');
const { BASE_API_URL } = require('../../config');

router.get('/banner', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/banner`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
