import { StyleSheet, View } from 'react-native';
import EditPetForm from '@/components/organisms/EditPetForm';

const EditPetScreen = () => {
  return (
    <View style={styles.main}>
      <EditPetForm />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  }
});

export default EditPetScreen;
