import { View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { getPets, Pet } from '@/src/Pets';
import { StyleSheet } from 'react-native';
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
