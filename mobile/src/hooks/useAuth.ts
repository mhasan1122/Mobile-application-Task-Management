import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, setError, setLoading, setSuccessMessage, logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.227:8000/api'; // Django backend port

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  // Check for existing token on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken) {
          dispatch(setCredentials({ 
            token: storedToken, 
            user: storedUser ? JSON.parse(storedUser) : undefined 
          }));
        }
      } catch (err) {
        console.error('Error checking token:', err);
      }
    };
    checkToken();
  }, [dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data in AsyncStorage
      const token = data.data.access;
      if (!token) {
        throw new Error('No token received from server');
      }
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: data.data.id,
        email: data.data.email,
        name: data.data.username,
      }));
      
      // Update Redux state
      dispatch(setCredentials({ 
        user: {
          id: data.data.id,
          email: data.data.email,
          name: data.data.username,
        },
        token: token
      }));

      return true;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      // Clear any existing token on error
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username: name,
          password
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Don't store token or user data since we're redirecting to login
      dispatch(setSuccessMessage('Registration successful! Please log in with your new account.'));
      return true;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const logoutUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      dispatch(logout());
    } catch (err) {
      dispatch(setError('Failed to logout'));
    }
  }, [dispatch]);
  return {
    user,
    token,
    isLoading,
    error,
    successMessage: useSelector((state: RootState) => state.auth.successMessage),
    login,
    register,
    logout: logoutUser,
  };
};