import { View } from '@/components/Themed';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import PetForm from '@/components/organisms/PetForm';
import { addPet, getPets, Pet } from '@/src/Pets';
import { StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LostAndFoundPostForm from '@/components/organisms/LostAndFoundPostForm';
import { useEffect, useState } from 'react';

const AddPostScreen = () => {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    (async () => {
      const { pets } = await getPets();
      setPets(pets);
    })();
  }, []);


  return (
    <View style={styles.main}>
      <LostAndFoundPostForm buttonText="Submit" pets={pets} />
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
  }
})

export default AddPostScreen;
