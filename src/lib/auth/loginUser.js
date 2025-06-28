import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  const {
    _id,
    firstName,
    lastName,
    profileImageUrl,
    gamesWon,
    cleanSweaps,
    perfects,
  } = user ?? {};
  const userData = {
    userId: _id,
    firstName,
    lastName,
    profileImageUrl,
    email,
    gamesWon,
    cleanSweaps,
    perfects,
  };
  const accessToken = jwt.sign(userData, process.env.JWT_ACCESS_SECRET);

  return {
    user: userData,
    accessToken,
  };
};
