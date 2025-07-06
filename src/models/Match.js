import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema(
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
    battleRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Battle',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);
