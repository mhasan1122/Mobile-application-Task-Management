import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import TaskCard from '../../components/TaskCard';
import { useTasks } from '../../hooks/useTasks';
import Button from '../../components/Button';
import { Task } from '../../types';

type TaskStackParamList = {
  TaskList: undefined;
  CreateTask: undefined;
  TaskDetails: { task: Task };
};

type NavigationType = NavigationProp<TaskStackParamList>;

const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const { tasks, isLoading, error, fetchTasks, updateTaskStatus } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetails', { task });
  };

  const handleStatusChange = async (task: Task) => {
    const nextStatus = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    }[task.status] as Task['status'];

    await updateTaskStatus(task.id, nextStatus);
  };

  const handleCreateTask = () => {
    navigation.navigate('CreateTask');
  };

  const renderEmptyList = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        No tasks yet. Create your first task!
      </Text>
      <Button
        title="Create Task"
        onPress={handleCreateTask}
        variant="primary"
      />
    </View>
  );

  if (isLoading && (!tasks || !tasks.length)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <TaskCard
            task={item}
            isFirstCard={index === 0}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchTasks} />
        }
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
      >
        <Button
          title="+"
          onPress={handleCreateTask}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            padding: 0,
          }}
        />
      </View>
    </View>
  );
};

export default TaskListScreen;