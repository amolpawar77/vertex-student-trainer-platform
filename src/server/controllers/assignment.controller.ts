import { Request, Response, NextFunction } from 'express';
import { listAssignments, createAssignment } from '../services/assignment.service';

export async function getAssignments(req: Request, res: Response, next: NextFunction) {
  try {
    const records = await listAssignments();
    return res.status(200).json({ data: { records } });
  } catch (error) {
    next(error);
  }
}

export async function postAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const record = await createAssignment(req.body);
    return res.status(201).json({ data: { record } });
  } catch (error) {
    next(error);
  }
}
