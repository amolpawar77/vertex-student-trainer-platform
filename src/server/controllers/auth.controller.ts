import { Request, Response, NextFunction } from 'express';
import { authenticateUser, registerUser } from '../services/auth.service';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authenticateUser(email, password);
    return res.status(200).json({ data: { record: result.record, token: result.token } });
  } catch (error) {
    next(error);
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, role } = req.body;
    const result = await registerUser({ email, password, name, role });
    return res.status(201).json({ data: { record: result.record, token: result.token } });
  } catch (error) {
    next(error);
  }
}
