import { Router } from 'express';
import authRoutes from './auth.routes';
import assignmentRoutes from './assignment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/assignments', assignmentRoutes);

export default router;
