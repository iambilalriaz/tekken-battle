// models/BattleRequest.js
import mongoose from 'mongoose';

const BattleRequestSchema = new mongoose.Schema({
  requester: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    profileImage: { type: String },
  },
  acceptor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    profileImage: { type: String },
  },
  status: {
    type: String,
    enum: ['requested', 'in-match', 'rejected'],
    default: 'requested',
  },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
  createdAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  expiresAt: {
    type: Date,
    default: null,
    index: { expireAfterSeconds: 0 }, // TTL works only if expiresAt is set
  },
});

export default mongoose.models.BattleRequest ||
  mongoose.model('BattleRequest', BattleRequestSchema);
