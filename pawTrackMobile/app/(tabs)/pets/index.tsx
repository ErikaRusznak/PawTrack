import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, theme, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';
import PetCard from '@/components/moleculas/pets/PetCard';
import { TextMedium } from '@/components/StyledText';
import { useRouter } from 'expo-router';

const PetsScreen = () => {

  const router = useRouter();
  const addPet = () => {
    router.replace("/(tabs)/pets/add");
  };

  return (
    <MainView>
      <View style={styles.screen}>
        <View style={styles.filterAndAdd}>
          <TextMedium>Add</TextMedium>
          <TouchableOpacity onPress={addPet} style={styles.logoutButton}>
            <TextMedium style={styles.logoutText}>Add pet</TextMedium>
          </TouchableOpacity>
        </View>
        <View style={styles.petCards}>
          <PetCard />
          <PetCard />
          <PetCard />
        </View>
      </View>

    </MainView>
  );
};

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  filterAndAdd: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petCards: {
    flexDirection: "column",
    gap: 8
  },
  logoutButton: {
    backgroundColor: theme.orange,
    padding: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: theme.yellow,
  },
});

export default PetsScreen;