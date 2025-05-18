const express = require('express');
const router = express.Router();
const db = require('../../db');
const verifyToken = require('../../middlewares/authMiddleware');

router.get('/balance', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.execute('SELECT balance FROM balances WHERE user_id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Balance not found' });
        }

        res.json({ balance: rows[0].balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
