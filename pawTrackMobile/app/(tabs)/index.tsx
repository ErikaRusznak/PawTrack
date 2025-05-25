import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomCalendar from '@/components/atoms/CustomCalendar';
import { getPetsForUser, Pet } from '@/src/Pets';
import { Task } from '@/src/Task';
import { getTasksForPets } from '@/src/Task';
import { getTheme } from '@/components/Themed';
import { TextBold, TextLight, TextMedium, TextRegular, TextSemiBold } from '@/components/StyledText';

const HomeScreen = () => {
  const theme = getTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);

  const getTasks = async () => {
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
  }

  useEffect(() => {
    getTasks();
  }, [selectedDate]);

  const handleDateSelect = (day: any) => {
    setSelectedDate(new Date(day.dateString));
    setCalendarVisible(false);
  };

  const formatDateText = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    return selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
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
        {tasks.map((task, idx) => {
          const pet = pets.find(p => p.id === task.petId);
          return (
            <View key={task.id} style={styles.taskCard}>
              <View style={{ flex: 1 }}>
                <TextSemiBold style={styles.taskTitle}>{task.taskTitle}</TextSemiBold>
                <TextRegular style={styles.taskTime}>{formatTaskTime(task)}</TextRegular>
              </View>
              {pet?.picture && (
                <Image source={{ uri: pet.picture }} style={styles.petImage} />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

function formatTaskTime(task: Task) {
  if (!task.taskDate) return '';
  const date =
    task.taskDate && typeof (task.taskDate as any).toDate === 'function'
      ? (task.taskDate as any).toDate()
      : new Date(task.taskDate);

  if (isNaN(date.getTime())) return 'Invalid Date';

  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${timeStr}`;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    gap: 10,
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
});

export default HomeScreen;
