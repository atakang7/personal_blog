// src/models/Comments.js
import mongoose from 'mongoose';
import { getModel } from '@/lib/mongodb';
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  authorName: { type: String, ref: 'Users', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Blogs', required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });


export const Comments = getModel('Comments', commentSchema);