import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';

type TaskStackParamList = {
  TaskDetails: { task: Task };
};

type TaskDetailsScreenRouteProp = RouteProp<TaskStackParamList, 'TaskDetails'>;
type TaskDetailsScreenNavigationProp = NativeStackNavigationProp<TaskStackParamList, 'TaskDetails'>;

const TaskDetailsScreen: React.FC = () => {
  const route = useRoute<TaskDetailsScreenRouteProp>();
  const navigation = useNavigation<TaskDetailsScreenNavigationProp>();
  const { task } = route.params;
  const { updateTaskStatus, deleteTask } = useTasks();

  const handleStatusChange = async () => {
    try {
      await updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed');
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[
            styles.status,
            { color: task.status === 'completed' ? '#4CAF50' : '#FFA000' }
          ]}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.value}>{formatDate(task.dueDate)}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>{formatDate(task.createdAt)}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Last Updated:</Text>
          <Text style={styles.value}>{formatDate(task.updatedAt)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.statusButton]}
            onPress={handleStatusChange}
          >
            <Text style={styles.buttonText}>
              Mark as {task.status === 'completed' ? 'Pending' : 'Completed'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FF5252',
  },
});

export default TaskDetailsScreen; 