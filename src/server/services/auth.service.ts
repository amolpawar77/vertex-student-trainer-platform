import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/user.model';
import { JWT_SECRET } from '../config';

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
  role?: 'student' | 'trainer';
}

export interface AuthToken {
  accessToken: string;
  expiresIn: number;
}

function createToken(user: IUser): AuthToken {
  const expiresIn = 60 * 60 * 24; // 24 hours
  const accessToken = jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn,
    }
  );

  return { accessToken, expiresIn };
}

export async function registerUser(payload: AuthPayload) {
  const existing = await UserModel.findOne({ email: payload.email.toLowerCase().trim() }).exec();
  if (existing) {
    throw new Error('User already exists with the provided email');
  }

  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await UserModel.create({
    uid: `user-${Date.now()}`,
    email: payload.email.toLowerCase().trim(),
    password: hashed,
    name: payload.name || payload.email.split('@')[0],
    role: payload.role || 'student',
    avatar: '',
    batch: payload.role === 'student' ? 'Unassigned' : 'N/A',
    status: 'active',
    progress: 0,
  });

  return {
    record: sanitizeUser(user),
    token: createToken(user),
  };
}

export async function authenticateUser(email: string, password: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).exec();
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return {
    record: sanitizeUser(user),
    token: createToken(user),
  };
}

export function sanitizeUser(user: IUser) {
  return {
    id: user._id.toString(),
    uid: user.uid,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    batch: user.batch,
    status: user.status,
    progress: user.progress,
    createdAt: user.createdAt,
  };
}
