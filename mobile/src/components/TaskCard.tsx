import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';

type TaskStackParamList = {
  TaskDetails: { task: Task };
};

type TaskCardProps = {
  task: Task;
  isFirstCard?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, isFirstCard = false }) => {
  const navigation = useNavigation<NativeStackNavigationProp<TaskStackParamList>>();
  const { updateTaskStatus, removeTask } = useTasks();

  const statusColors = {
    pending: {
      bg: '#FFF3E0',
      text: '#FF9800',
      border: '#FFE0B2'
    },
    in_progress: {
      bg: '#E3F2FD',
      text: '#2196F3',
      border: '#BBDEFB'
    },
    completed: {
      bg: '#E8F5E9',
      text: '#4CAF50',
      border: '#C8E6C9'
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleStatusChange = async () => {
    try {
      await updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed');
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTask(task.id);
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task. Please try again.');
            }
          },
        },
      ],
    );
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <View style={styles.wrapper}>
      {isFirstCard && (
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome to Task Management</Text>
            <Text style={styles.welcomeSubtitle}>Let's organize your day efficiently</Text>
            <View style={styles.welcomeDivider} />
            <Text style={styles.welcomeTip}>💡 Tap on a task to view details</Text>
          </View>
        </View>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed
        ]}
        onPress={() => navigation.navigate('TaskDetails', { task })}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {task.title}
            </Text>
            <TouchableOpacity
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[task.status].bg }
              ]}
              onPress={handleStatusChange}
            >
              <Text style={[
                styles.statusText,
                { color: statusColors[task.status].text }
              ]}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Text style={[
                styles.date,
                isOverdue && styles.overdueDate
              ]}>
                {isOverdue ? '⚠️ Overdue: ' : '📅 Due: '}
                {formatDate(task.dueDate)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.deleteText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
    width: '100%',
  },
  welcomeContainer: {
    marginBottom: 20,
    paddingHorizontal: 0,
    marginTop: 20,
    width: '100%',
  },
  welcomeCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BBDEFB',
    marginHorizontal: 0,
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#1976D2',
    marginBottom: 30,
  },
  welcomeDivider: {
    height: 1,
    backgroundColor: '#BBDEFB',
    marginBottom: 16,
  },
  welcomeTip: {
    fontSize: 14,
    color: '#1976D2',
    fontStyle: 'italic',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  overdueDate: {
    color: '#FF5252',
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  deleteText: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TaskCard; 