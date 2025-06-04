import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, TouchableOpacity, ScrollView, Text, View} from 'react-native';
import PetCard from '@/components/moleculas/pets/PetCard';
import { TextMedium } from '@/components/StyledText';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { deletePet, getPetsForUser, Pet, updatePetFoundStatus } from '@/src/Pets';
import PetActionsPopup from '@/components/moleculas/pets/PetActionsPopup';
import { useFocusEffect } from '@react-navigation/native';
import {markLatestPostByPetIdAsFound} from "@/src/LostAndFoundPost";

const PetsScreen = () => {
  const router = useRouter();
  const addPet = () => {
    router.replace("/(tabs)/pets/add");
  };

  const [pets, setPets] = useState<Pet[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const getPets = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      if (!id) return;
      const petsForUser = await getPetsForUser(id);
      setPets(petsForUser);
  }

  useEffect(() => {
    getPets();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getPets();
    }, [])
  );

  // pop up
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleOptions = (pet: Pet) => {
    setSelectedPet(pet);
    setPopupVisible(true);
  };

  const handleMarkAsFound = async (petId: string) => {
    if (!userId) return;
    await updatePetFoundStatus(petId, true);
    await markLatestPostByPetIdAsFound(petId);
    const petsForUser = await getPetsForUser(userId);
    setPets(petsForUser);
  };

  const handleDelete = async (petId: string) => {
    if (!userId) return;
    await deletePet(petId);
    const petsForUser = await getPetsForUser(userId);
    setPets(petsForUser);
  };

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.filterAndAdd}>
          <TextMedium></TextMedium>
          <TouchableOpacity onPress={addPet} style={styles.addPetButton}>
            <TextMedium style={styles.addPetText}>Add pet</TextMedium>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.petCards}>
          {pets.length === 0 && (
              <Text style={styles.noPets}>No pets.</Text>
          )}
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onOptionsPress={() => handleOptions(pet)} />
          ))}
        </ScrollView>
      </View>
      {selectedPet && (
        <PetActionsPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          pet={selectedPet!}
          onMarkAsFound={handleMarkAsFound}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  filterAndAdd: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petCards: {
    flexDirection: "column",
    gap: 20,
    marginHorizontal: 2
  },
  addPetButton: {
    backgroundColor: "#d98324",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  addPetText: {
    color: "#f2f6d0",
    fontSize: 20,
  },
  noPets: {
    textAlign: 'center',
    color: '#999',
    fontSize: 18,
    marginTop: 4,
  },
});

export default PetsScreen;