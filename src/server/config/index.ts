import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT || 3000);
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
