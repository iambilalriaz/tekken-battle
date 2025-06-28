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
    enum: ['pending', 'accepted', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 mins
    index: { expires: 0 }, // TTL index (MongoDB auto-deletes expired docs)
  },
});

export default mongoose.models.BattleRequest ||
  mongoose.model('BattleRequest', BattleRequestSchema);
