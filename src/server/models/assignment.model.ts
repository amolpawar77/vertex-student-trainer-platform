import { Schema, model, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  type: 'coding' | 'theory';
  batch: string;
  dueDate: string;
  status: 'active' | 'graded' | 'draft';
  submissions: number;
  total: number;
  createdBy: string;
  createdAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['coding', 'theory'], default: 'coding' },
  batch: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['active', 'graded', 'draft'], default: 'active' },
  submissions: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'assignments',
});

export const AssignmentModel = model<IAssignment>('Assignment', AssignmentSchema);
