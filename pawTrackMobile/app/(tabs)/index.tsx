import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import EditScreenInfo from '@/components/EditScreenInfo';

const HomeScreen = () => {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Home Screen</Text>
      <EditScreenInfo />
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
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

export default HomeScreen;
