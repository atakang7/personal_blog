// src/models/Users.js
import mongoose from 'mongoose';
import { getModel } from '@/lib/mongodb';

const userSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, required: true },
  password: { type: String, required: true },
  imageURL: { type: String, default: '/img/avatar.webp' },
  isSubscribed: { type: Boolean, required: false, default: false },
  googleId: { type: String },
  name: { type: String, default: 'Guest' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  degree: { type: String, enum: ['Bachelor', 'Master', 'PhD'], default: 'Bachelor' },
  visitCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const Users = getModel('Users', userSchema);