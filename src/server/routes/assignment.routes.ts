import { Router } from 'express';
import { getAssignments, postAssignment } from '../controllers/assignment.controller';

const router = Router();

router.get('/', getAssignments);
router.post('/', postAssignment);

export default router;
