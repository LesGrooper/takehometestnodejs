const express = require('express');
const router = express.Router();
const db = require('../../db');
const verifyToken = require('../../middlewares/authMiddleware');

router.post('/transaction', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { service_code, amount } = req.body; // `amount` harus dikirim

    try {
        await db.beginTransaction();

        const [balanceRows] = await db.execute(
            'SELECT balance FROM balances WHERE user_id = ?',
            [userId]
        );

        if (balanceRows.length === 0 || balanceRows[0].balance < amount) {
            await db.rollback();
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        await db.execute(
            'INSERT INTO transactions (user_id, service_code, amount) VALUES (?, ?, ?)',
            [userId, service_code, amount]
        );

        await db.execute(
            'UPDATE balances SET balance = balance - ? WHERE user_id = ?',
            [amount, userId]
        );

        await db.commit();

        res.status(200).json({ message: 'Transaction successful', amount });
    } catch (error) {
        await db.rollback();
        res.status(500).json({ message: error.message });
    }
});

// GET transaction history
router.get('/transaction/history', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );

        res.status(200).json({ history: rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
