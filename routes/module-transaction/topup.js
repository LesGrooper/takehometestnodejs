const express = require('express');
const router = express.Router();
const db = require('../../db');
const verifyToken = require('../../middlewares/authMiddleware');

router.post('/topup', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { top_up_amount } = req.body;

    try {
        await db.beginTransaction();

        await db.execute(
            'INSERT INTO topups (user_id, amount) VALUES (?, ?)',
            [userId, top_up_amount]
        );

        const [existing] = await db.execute(
            'SELECT * FROM balances WHERE user_id = ?',
            [userId]
        );

        if (existing.length > 0) {
            await db.execute(
                'UPDATE balances SET balance = balance + ? WHERE user_id = ?',
                [top_up_amount, userId]
            );
        } else {
            await db.execute(
                'INSERT INTO balances (user_id, balance) VALUES (?, ?)',
                [userId, top_up_amount]
            );
        }

        await db.commit();

        res.status(200).json({ message: 'Top up successful', top_up_amount });
    } catch (error) {
        await db.rollback();
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
