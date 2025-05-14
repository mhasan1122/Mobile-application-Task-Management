import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';

type TaskStackParamList = {
  TaskList: undefined;
  CreateTask: undefined;
  TaskDetails: { task: Task };
};

type NavigationType = NavigationProp<TaskStackParamList>;

const CreateTaskScreen: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const { createTask, isLoading, error } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateContent = (text: string) => {
    // Add profanity check - this is a simple example, you might want to use a proper profanity filter library
    const profanityList = ['fuck', 'bitch', 'shit', 'ass'];
    return !profanityList.some(word => text.toLowerCase().includes(word));
  };

  const handleCreateTask = async () => {
    setValidationError(null);
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setValidationError('Title is required');
      return;
    }

    if (!validateContent(trimmedTitle) || !validateContent(trimmedDescription)) {
      setValidationError('Please remove inappropriate language');
      return;
    }

    try {
      await createTask({
        title: trimmedTitle,
        description: trimmedDescription,
        dueDate: dueDate || new Date().toISOString(),
        status: 'pending',
      });

      navigation.goBack();
    } catch (err) {
      console.error('Failed to create task:', err);
      setValidationError('Failed to create task. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F8F9FA' }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 8,
            }}
          >
            Create New Task
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#666',
            }}
          >
            Fill in the details below
          </Text>
        </View>

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          multiline
        />

        <Input
          label="Due Date"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
        />

        {validationError && (
          <Text
            style={{
              color: '#FF3B30',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {validationError}
          </Text>
        )}

        {error && (
          <Text
            style={{
              color: '#FF3B30',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {error}
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}
        >
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title={isLoading ? 'Creating...' : 'Create Task'}
            onPress={handleCreateTask}
            style={{ flex: 1, marginLeft: 8 }}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateTaskScreen;