export type Role = 'admin' | 'trainer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  batch?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  type: 'coding' | 'theory';
  status: 'pending' | 'submitted' | 'graded';
}

export interface Session {
  id: string;
  title: string;
  trainer: string;
  date: string;
  time: string;
  duration: string;
  link?: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}
