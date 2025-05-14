import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import CreateTaskScreen from '../screens/tasks/CreateTaskScreen';
import TaskDetailsScreen from '../screens/tasks/TaskDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { Task } from '../types';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type TaskStackParamList = {
  TaskList: undefined;
  CreateTask: undefined;
  TaskDetails: { task: Task };
};

type TasksTabParamList = {
  Tasks: undefined;
  Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const TaskStack = createNativeStackNavigator<TaskStackParamList>();
const Tab = createBottomTabNavigator<TasksTabParamList>();

const AuthNavigator: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const TaskNavigator: React.FC = () => (
  <TaskStack.Navigator>
    <TaskStack.Screen
      name="TaskList"
      component={TaskListScreen}
      options={{ headerShown: false }}
    />
    <TaskStack.Screen
      name="CreateTask"
      component={CreateTaskScreen}
      options={{ title: 'Create Task' }}
    />
    <TaskStack.Screen
      name="TaskDetails"
      component={TaskDetailsScreen}
      options={{ title: 'Task Details' }}
    />
  </TaskStack.Navigator>
);

const MainTabs: React.FC = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Tasks"
      component={TaskNavigator}
      options={{ headerShown: false }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const Navigation: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {token ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Navigation;