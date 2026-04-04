import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'trainer' | 'admin';
  avatar?: string;
  batch?: string;
  status: 'active' | 'inactive';
  progress: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'trainer', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  batch: { type: String, default: 'Unassigned' },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'users',
});

export const UserModel = model<IUser>('User', UserSchema);
