const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: String,
  text: String,
  imageUrl: String,
  likes: [String],        
  comments: [CommentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
