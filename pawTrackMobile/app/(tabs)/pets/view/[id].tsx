import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from '@/components/Themed';
import Toast from 'react-native-toast-message';
import PetForm from '@/components/organisms/PetForm';
import { getPetById, updatePet } from '@/src/Pets';

const ViewPetScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [petData, setPetData] = useState<any>(null);

  useEffect(() => {
    const loadPet = async () => {
      const petContent = await getPetById(id as string);
      if (petContent?.exists()) setPetData(petContent.data());
    };
    loadPet();
  }, [id]);

  const handleUpdatePet = async (data: any) => {
    try {
      await updatePet(id as string, data);
      Toast.show({ type: 'success', text1: 'Pet updated!' });
      router.back();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Update failed' });
      console.error(err);
    }
  };

  if (!petData) return null;

  return (
    <View>
      {/* <PetForm defaultValues={petData} onSubmit={handleUpdatePet} buttonText="Update" /> */}
    </View>
  );
};

export default ViewPetScreen;
