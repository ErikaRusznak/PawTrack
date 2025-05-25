import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import { getPetById } from '@/src/Pets';
import { getTasksByPetId } from '@/src/Task';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import {getTheme} from "@/components/Themed";

const ViewPetScreen = () => {
  const { id } = useLocalSearchParams();2
  const theme = getTheme();
  const [petData, setPetData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const loadPetAndTasks = async () => {
      const petContent = await getPetById(id as string);
      if (!petContent) return;
      setPetData(petContent)

      const taskList = await getTasksByPetId(id as string);

      setTasks(taskList);
    };

    loadPetAndTasks();
  }, [id]);

  if (!petData) return null;

  const vaccinations = tasks.filter((t) => t.taskTitle === 'Vaccination');
  const appointments = tasks.filter((t) => t.taskTitle === 'Vet appointment');

  const renderStatusIcon = (dateStr: string, completed: boolean) => {
    if (completed) {
      return <MaterialIcons name="check-circle" size={20} color="#4CAF50" />;
    }
    const now = new Date();
    const date = new Date(dateStr);
    if (date > now) {
      return <MaterialIcons name="schedule" size={20} color="#A67C00" />;
    } else if(date == now) {
      return <MaterialIcons name="error" size={20} color="#2196F3" />;
    } else {
        return <MaterialIcons name="cancel" size={20} color="#F44336" />;
    }
  };

  return (
      <ScrollView style={styles.main}>
        <View style={styles.profileSection}>
          <Image source={{ uri: petData.picture }} style={styles.profileImage} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.petName} >{petData.name}</Text>
            <Text style={styles.petInfo}>
              {petData.animalType}, {petData.age} years old
            </Text>
            <Text style={styles.petDetails}>{petData.details}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.brown }}>
            <FontAwesome name="medkit" size={16} /> Vaccinations
          </Text>
          {vaccinations.map((v, i) => (
              <View
                  key={i}
                  style={{
                    backgroundColor: theme.beige,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
              >
                <View>
                  <Text style={{ fontWeight: '600', color: theme.brown }}>{v.details}</Text>
                  <Text style={{ color: theme.brown }}>{new Date(v.taskDate.toDate()).toLocaleString()}</Text>
                </View>
                {renderStatusIcon(v.taskDate.toDate(), v.completed)}
              </View>
          ))}
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.brown }}>
            <FontAwesome name="user-md" size={16} /> Vet Appointments
          </Text>
          {appointments.map((v, i) => (
              <View
                  key={i}
                  style={{
                    backgroundColor: theme.beige,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
              >
                <View>
                  <Text style={{ fontWeight: '600', color: theme.brown }}>{v.details}</Text>
                  <Text style={{ color: theme.brown }}>{new Date(v.taskDate.toDate()).toLocaleString()}</Text>
                </View>
                {renderStatusIcon(v.taskDate.toDate(), v.completed)}
              </View>
          ))}
        </View>
      </ScrollView>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#443627'
  },
  petInfo: {
    fontSize: 16,
    marginBottom: 4,
    color: '#443627'
  },
  petDetails: {
    fontSize: 14,
    color: '#443627'
  },

});
export default ViewPetScreen;
