import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from '@/components/Themed';
import Toast from 'react-native-toast-message';
import PetForm from '@/components/organisms/PetForm';
import { getPetById, Pet, updatePet } from '@/src/Pets';
import { StyleSheet, Text } from 'react-native';
import { TextMedium } from '@/components/StyledText';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase/firebaseConfig';
import uuid from 'react-native-uuid';

const EditPetScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [petData, setPetData] = useState<any>(null);

  const loadPet = async () => {
    const petContent = await getPetById(id as string);
    if (!!petContent) setPetData({ ...petContent, age: String(petContent.age) });
  };

  useEffect(() => {
    loadPet();
  }, []);

  useEffect(() => {
    loadPet();
  }, [id]);

  const handleUpdatePet = async (data: Pet, selectedImageUri?: string) => {
    try {
      let pictureUrl;

      if (selectedImageUri) {
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
        const fileRef = ref(storage, `petPictures/${uuid.v4()}.jpg`);
        await uploadBytes(fileRef, blob);
        pictureUrl = await getDownloadURL(fileRef);
      }
      await updatePet(id as string, {...data, picture: pictureUrl});
      Toast.show({ type: 'success', text1: 'Pet updated!' });
      router.replace("/(tabs)/pets");
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Update failed' });
      console.error(err);
    }
  };

  if (!petData) return <TextMedium>Loading...</TextMedium>;

  return (
    <View style={styles.main}>
      {petData &&
        <PetForm defaultValues={petData} onSubmit={handleUpdatePet} buttonText="Update" />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  }
})

export default EditPetScreen;
