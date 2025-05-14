import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskState, Task } from '../../types';

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload || [];
    },
    addTask: (state, action: PayloadAction<Task>) => {
      if (!state.tasks) {
        state.tasks = [];
      }
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      if (!state.tasks) {
        state.tasks = [];
        return;
      }
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      if (!state.tasks) {
        state.tasks = [];
        return;
      }
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} = taskSlice.actions;
export default taskSlice.reducer; 