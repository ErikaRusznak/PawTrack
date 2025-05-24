import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
const LostAndFoundScreen = () => {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LostAndFoundScreen;
