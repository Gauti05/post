const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });


router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post content missing' });
    }

    const post = new Post({
      userId: req.user.id,
      username: req.user.username,
      text,
      imageUrl,
      likes: [],
      comments: [],
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});


router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

module.exports = router;
