const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

// Define uploads folder relative to this file (routes/)
const UPLOADS_FOLDER = path.join(__dirname, '..', 'uploads');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Multer upload with 5MB max file size
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  '/',
  authMiddleware,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer upload error:', err);
        return res.status(400).json({ message: `File upload error: ${err.message}` });
      } else if (err) {
        console.error('Unknown upload error:', err);
        return res.status(500).json({ message: `Upload failed: ${err.message}` });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      console.log('Authenticated user:', req.user);
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

      if (!req.user || !req.user.id || !req.user.username) {
        return res.status(401).json({ message: 'Unauthorized: User info missing' });
      }

      // Validate content
      const { text } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!text && !imageUrl) {
        return res.status(400).json({ message: 'Post content missing' });
      }

      // Convert userId to ObjectId in case it's a string
      const userId = mongoose.Types.ObjectId(req.user.id);

      const post = new Post({
        userId,
        username: req.user.username,
        text,
        imageUrl,
        likes: [],
        comments: [],
      });

      const savedPost = await post.save();

      res.status(201).json(savedPost);
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error while creating post' });
    }
  }
);

module.exports = router;

