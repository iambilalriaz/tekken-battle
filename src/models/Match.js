// models/Match.js
import mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema(
  {
    player1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    loser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    player1Perfects: { type: Number, default: 0 },
    player2Perfects: { type: Number, default: 0 },
    cleanSweep: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);
