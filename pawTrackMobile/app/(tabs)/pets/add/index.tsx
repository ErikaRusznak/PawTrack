import { View } from '@/components/Themed';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import PetForm from '@/components/organisms/PetForm';
import { addPet, Pet } from '@/src/Pets';
import { StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const AddPetScreen = () => {
  const router = useRouter();

  const handleAddPet = async (data: Pet, selectedImageUri?: string) => {
    try {
      let pictureUrl;

      if (selectedImageUri) {
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
        const fileRef = ref(storage, `petPictures/${uuid.v4()}.jpg`);
        await uploadBytes(fileRef, blob);
        pictureUrl = await getDownloadURL(fileRef);
      }

      const petToSave: Pet = {
        ...data,
        picture: pictureUrl,
        age: Number(data.age),
        found: true,
      };

      await addPet(petToSave);
      Toast.show({ type: 'success', text1: 'Pet added!' });
      router.replace("/(tabs)/pets");
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to add pet' });
      console.error(err);
    }
  };
  return (
    <View style={styles.main}>
      <PetForm onSubmit={handleAddPet} buttonText="Submit" />
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

export default AddPetScreen;
