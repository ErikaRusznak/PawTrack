import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Image, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomCalendar from '@/components/atoms/CustomCalendar';
import { getPetsForUser, Pet } from '@/src/Pets';
import { setTaskOnCompleted, Task } from '@/src/Task';
import { getTasksForPets } from '@/src/Task';
import { getTheme } from '@/components/Themed';
import { TextMedium, TextRegular, TextSemiBold } from '@/components/StyledText';
import { Dimensions } from 'react-native';
import { formatTaskDate, formatTaskTime } from '@/util/HelperFunctions';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const theme = getTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});
  const [isModalImageLoading, setIsModalImageLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;

  const getTasks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const petsForUser = await getPetsForUser(userId);
      setPets(petsForUser);
      if (petsForUser.length > 0) {
        const petIds = petsForUser.map(p => p.id);
        const tasksForPets = await getTasksForPets(petIds, selectedDate);
        setTasks(tasksForPets);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error loading vets:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTasks();
  }, [selectedDate]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.orange} />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  const handleDateSelect = (day: any) => {
    setSelectedDate(new Date(day.dateString));
    setCalendarVisible(false);
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setTaskModalVisible(true);
  };

  const formatDateText = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    return selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const handleCompleted = async (selectedTask) => {
    await setTaskOnCompleted(selectedTask.id, true);
    setTaskModalVisible(false);
    Toast.show({ type: 'success', text1: 'Task completed!' });
    setLoading(true);
    await getTasks();
  };

  return (
    <View style={styles.main}>
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.todayBtn} onPress={() => setCalendarVisible(true)}>
          <TextRegular style={styles.todayText}>{formatDateText()}</TextRegular>
          <Feather name="chevron-down" size={20} color={theme.brown} />
        </TouchableOpacity>
        <Modal visible={calendarVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalBg}
            activeOpacity={1}
            onPress={() => setCalendarVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.calendarModal}>
                <CustomCalendar handleDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.taskList}>
        {tasks.length === 0 && (
          <Text style={styles.noTasks}>No tasks for this day.</Text>
        )}
        {tasks.map((task) => {
          const pet = pets.find(p => p.id === task.petId);
          return (
            <TouchableOpacity key={task.id} onPress={() => handleTaskPress(task)}>
              <View style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
                <View style={{ flex: 1 }}>
                  <TextSemiBold style={styles.taskTitle}>{task.taskTitle}</TextSemiBold>
                  <TextRegular style={styles.taskTime}>{formatTaskTime(task)}</TextRegular>
                </View>
                {pet?.picture && (
                  <View style={{ position: 'relative', width: 70, height: 70 }}>
                    {imageLoadingStates[task.id] && (
                      <View style={styles.imageLoader}>
                        <ActivityIndicator size="small" color={theme.orange} />
                      </View>
                    )}
                    <Image
                      source={{ uri: pet.picture }}
                      style={styles.petImage}
                      onLoadStart={() =>
                        setImageLoadingStates(prev => ({ ...prev, [task.id]: true }))
                      }
                      onLoadEnd={() =>
                        setImageLoadingStates(prev => ({ ...prev, [task.id]: false }))
                      }
                    />
                    {task.completed && (
                      <View style={styles.checkmarkContainer}>
                        <Feather name="check" size={28} color="#4BB543" />
                      </View>
                    )}
                  </View>
                )}

              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal visible={taskModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBg}
          activeOpacity={1}
          onPress={() => setTaskModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.taskModal, { width: screenWidth * 0.8 }]}>
              {selectedTask && (
                <>
                  <View style={styles.modalHeader}>
                    {(() => {
                      const petPicture = pets.find(p => p.id === selectedTask.petId)?.picture;

                      return petPicture ? (
                        <View style={{ position: 'relative', width: 80, height: 80 }}>
                          {isModalImageLoading && (
                            <View style={styles.modalImageLoader}>
                              <ActivityIndicator size="small" color={theme.orange} />
                            </View>
                          )}
                          <Image
                            source={{ uri: petPicture }}
                            style={styles.modalPetImage}
                            onLoadStart={() => setIsModalImageLoading(true)}
                            onLoadEnd={() => setIsModalImageLoading(false)}
                          />
                        </View>
                      ) : null;
                    })()}
                    <TextSemiBold style={styles.modalTaskTitle}>{selectedTask.taskTitle}</TextSemiBold>
                  </View>

                  <View style={styles.modalContent}>
                    <TextSemiBold style={styles.modalLabel}>Date:</TextSemiBold>
                    <TextRegular style={styles.modalValue}>{formatTaskDate(selectedTask)}</TextRegular>

                    <TextSemiBold style={styles.modalLabel}>Hours:</TextSemiBold>
                    <TextRegular style={styles.modalValue}>{formatTaskTime(selectedTask)}</TextRegular>

                    <TextSemiBold style={styles.modalLabel}>Details:</TextSemiBold>
                    <TextRegular style={styles.modalValue}>{selectedTask.details}</TextRegular>
                  </View>
                  <TouchableOpacity style={styles.button} onPress={() => handleCompleted(selectedTask)}>
                    <TextMedium style={styles.buttonText}>Complete task</TextMedium>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    gap: 10,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalImageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRow: {
    marginTop: 10,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayText: {
    fontSize: 28,
    color: '#443627',
    marginRight: 6,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  taskList: {
    paddingTop: 16,
    gap: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6e6b2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d98324',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  completedTaskCard: {
    backgroundColor: '#fff7d6',
    borderColor: '#4BB543',
    opacity: 0.85,
  },
  taskTitle: {
    fontSize: 18,
    color: '#443627',
  },
  taskTime: {
    fontSize: 15,
    color: '#443627',
    marginTop: 2,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#fff'
  },
  noTasks: {
    textAlign: 'center',
    color: '#999',
    fontSize: 18,
    marginTop: 4,
  },
  taskModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
    flexDirection: 'column',
  },
  modalPetImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  modalTaskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
    color: '#443627',
  },
  modalContent: {
    width: '100%',
  },
  modalLabel: {
    fontSize: 16,
    color: '#443627',
  },
  modalValue: {
    fontSize: 16,
    color: '#443627',
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#d98324",
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: "#f2f6d0",
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
    zIndex: 2,
    elevation: 3,
  },
});

export default HomeScreen;
