const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { BASE_API_URL } = require('../../config');
const authenticate = require('../../middleware/authenticate');
const multer = require('multer');
const upload = multer({ storage, fileFilter });


router.put('/profile/image', authenticate, upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File tidak ditemukan' });
  }

  try {
    await pool.query(
      'UPDATE users SET profile_image = ? WHERE id = ?',
      [file.buffer.toString('base64'), req.user.id]
    );

    res.json({ message: 'Foto profil berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile/update', authenticate, async (req, res) => {
    const { first_name, last_name } = req.body;
  
    try {
      await pool.query(
        'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
        [first_name, last_name, req.user.id]
      );
  
      res.json({ message: 'Profil berhasil diperbarui' });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
