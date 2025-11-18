import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    profileImageUrl: String,

    totalMatches: Number,
    gamesWon: Number,
    cleanSweaps: Number,
    perfects: Number,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model('User', UserSchema.index({ createdAt: -1 }));
