export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
} 