// src/models/Blogs.js
import mongoose from 'mongoose';
import { getModel } from '../lib/mongodb';

const blogSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    search_keywords: { type: String, required: true },
    authorMetadata: { type: Object, required: true },
    isTechnical: { type: Boolean, default: false },
    AICreated: { type: Boolean, default: false },
    imageURL: { type: String, default: '/img/404.jpeg' },
    isProject: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments', default: [] }],
    status: { type: String, enum: ['draft', 'review', 'published'], default: 'review' },
    publishedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
}, { timestamps: true });

export const Blogs = getModel('Blogs', blogSchema);
