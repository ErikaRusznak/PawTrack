import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { getPetById } from '@/src/Pets';
import { getTasksByPetId } from '@/src/Task';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Toast from "react-native-toast-message";

const ViewPetScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [petData, setPetData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const loadPetAndTasks = async () => {
      const petContent = await getPetById(id as string);
      if (!petContent?.exists()) return;

      const pet = petContent.data();
      setPetData(pet);

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
    } else {
      return <MaterialIcons name="error" size={20} color="#2196F3" />;
    }
  };

  return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Pet Info */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Image
              source={{ uri: petData.picture }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>{petData.name}</Text>
          <Text style={{ fontSize: 16, color: '#555' }}>
            {petData.animalType}, {petData.age} years old
          </Text>
          <Text style={{ textAlign: 'center', marginTop: 8, paddingHorizontal: 16 }}>
            {petData.details}
          </Text>
        </View>

        {/* Vaccinations */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
            <FontAwesome name="medkit" size={16} /> Vaccinations
          </Text>
          {vaccinations.map((v, i) => (
              <View
                  key={i}
                  style={{
                    backgroundColor: '#FCE9BA',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
              >
                <View>
                  <Text style={{ fontWeight: '600' }}>{v.details}</Text>
                  <Text>{new Date(v.taskDate.toDate()).toLocaleString()}</Text>
                </View>
                {renderStatusIcon(v.taskDate.toDate(), v.completed)}
              </View>
          ))}
        </View>

        {/* Vet Appointments */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
            <FontAwesome name="user-md" size={16} /> Vet Appointments
          </Text>
          {appointments.map((v, i) => (
              <View
                  key={i}
                  style={{
                    backgroundColor: '#FCE9BA',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
              >
                <View>
                  <Text style={{ fontWeight: '600' }}>{v.details}</Text>
                  <Text>{new Date(v.taskDate.toDate()).toLocaleString()}</Text>
                </View>
                {renderStatusIcon(v.taskDate.toDate(), v.completed)}
              </View>
          ))}
        </View>
      </ScrollView>
  );
};

export default ViewPetScreen;
