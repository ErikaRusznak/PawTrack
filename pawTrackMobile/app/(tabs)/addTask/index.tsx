import { View } from '@/components/Themed';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { StyleSheet } from 'react-native';
import TaskForm from '@/components/organisms/TaskForm';
import { Pet, getPets } from '@/src/Pets';
import { addTask, Task } from '@/src/Task';
import Toast from 'react-native-toast-message';

const AddTaskScreen = () => {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    (async () => {
      const { pets } = await getPets();
      setPets(pets);
    })();
  }, []);

  const handleAddTask = async (data: any) => {
    console.log('Adding task:', data);
    try {
      const taskToSave: Task = {
        ...data,
        completed: false,
        taskDate: data.taskDate ? new Date(data.taskDate) : null,
      };
      await addTask(taskToSave);
      Toast.show({ type: 'success', text1: 'Task added!' });
      router.back();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to add task' });
      console.error(err);
    }
  };

  return (
    <View style={styles.main}>
      <TaskForm onSubmit={handleAddTask} pets={pets} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default AddTaskScreen;
