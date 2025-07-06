import mongoose from 'mongoose';
import { BATTLE_STATUSES } from '../constants';

const BattleSchema = new mongoose.Schema({
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
    enum: [
      BATTLE_STATUSES.REQUESTED,
      BATTLE_STATUSES.IN_MATCH,
      BATTLE_STATUSES.FINISHED,
      BATTLE_STATUSES.REJECTED,
    ],
    default: BATTLE_STATUSES.REQUESTED,
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

export default mongoose.models.Battle || mongoose.model('Battle', BattleSchema);
