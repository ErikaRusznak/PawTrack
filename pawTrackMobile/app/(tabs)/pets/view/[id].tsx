import {View, StyleSheet} from 'react-native';
import PetDetailsView from "@/components/organisms/PetDetailsView";

const ViewPetScreen = () => {
  return (
      <View style={styles.main}>
        <PetDetailsView />
      </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16
  }
});
export default ViewPetScreen;
