import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} from '../store/slices/taskSlice';
import { Task, TaskState } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.227:8000/api'; // Django backend port

export const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error } = useSelector((state: RootState) => state.tasks as TaskState);

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Validate token format
    if (!token.startsWith('eyJ')) {
      throw new Error('Invalid token format');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.trim()}`,
    };
  };

  const fetchTasks = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const headers = await getAuthHeader();
      console.log('Fetching tasks with headers:', headers);
      
      const response = await fetch(`${API_URL}/tasks/`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        // Clear invalid token
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();
      console.log('Fetch tasks response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }

      // Transform the API response to match our Task type
      const tasksData = Array.isArray(data) ? data : (data.data || []);
      const transformedTasks: Task[] = tasksData.map((task: any) => ({
        id: String(task?.id || ''),
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || (task?.completed ? 'completed' : 'pending'),
        dueDate: task?.due_date || task?.created_at || new Date().toISOString(),
        createdAt: task?.created_at || new Date().toISOString(),
        updatedAt: task?.updated_at || new Date().toISOString()
      }));

      dispatch(setTasks(transformedTasks));
    } catch (err) {
      console.error('Error fetching tasks:', err);
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch(setLoading(true));
      const headers = await getAuthHeader();
      
      // Format due date as YYYY-MM-DD for the API
      const formattedDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined;
      
      console.log('Creating task with data:', { ...task, dueDate: formattedDueDate });
      const response = await fetch(`${API_URL}/tasks/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          due_date: formattedDueDate,
          completed: task.status === 'completed'
        }),
      });

      const responseData = await response.json();
      console.log('Create task response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create task');
      }

      // Transform the API response to match our Task type
      const newTask: Task = {
        id: String(responseData.data?.id || ''),
        title: responseData.data?.title || '',
        description: responseData.data?.description || '',
        status: responseData.data?.status || (responseData.data?.completed ? 'completed' : 'pending'),
        dueDate: responseData.data?.due_date || responseData.data?.created_at || new Date().toISOString(),
        createdAt: responseData.data?.created_at || new Date().toISOString(),
        updatedAt: responseData.data?.updated_at || new Date().toISOString()
      };

      dispatch(addTask(newTask));
      // Fetch updated task list after creating
      await fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, fetchTasks]);

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    try {
      dispatch(setLoading(true));
      const headers = await getAuthHeader();      const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          completed: status === 'completed'
        }),
      });

      const responseData = await response.json();
      console.log('Update task response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update task');
      }

      const taskData = responseData.data;
      if (!taskData) {
        throw new Error('Invalid response format from server');
      }

      // Transform the API response to match our Task type
      const updatedTask: Task = {
        id: String(taskData.id || taskId),
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || (taskData.completed ? 'completed' : 'pending'),
        dueDate: taskData.due_date || taskData.created_at || new Date().toISOString(),
        createdAt: taskData.created_at || new Date().toISOString(),
        updatedAt: taskData.updated_at || new Date().toISOString()
      };

      dispatch(updateTask(updatedTask));
    } catch (err) {
      console.error('Error updating task:', err);
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const removeTask = useCallback(async (taskId: string) => {
    try {
      dispatch(setLoading(false));
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete task');
      }

      dispatch(deleteTask(taskId));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
    removeTask,
  };
};