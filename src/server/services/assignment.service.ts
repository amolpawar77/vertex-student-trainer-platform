import { AssignmentModel, IAssignment } from '../models/assignment.model';

export async function listAssignments() {
  const assignments = await AssignmentModel.find().sort({ createdAt: -1 }).lean().exec();
  return assignments.map((assignment) => ({
    id: assignment._id.toString(),
    ...assignment,
  }));
}

export async function createAssignment(payload: Partial<IAssignment>) {
  const assignment = await AssignmentModel.create({
    title: payload.title || 'Untitled Assignment',
    description: payload.description || '',
    type: payload.type || 'coding',
    batch: payload.batch || 'General',
    dueDate: payload.dueDate || new Date().toISOString(),
    status: payload.status || 'active',
    submissions: payload.submissions || 0,
    total: payload.total || 0,
    createdBy: payload.createdBy || 'system',
  });

  return {
    id: assignment._id.toString(),
    ...assignment.toObject(),
  };
}
