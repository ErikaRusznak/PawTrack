import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';

const LostAndFoundScreen = () => {
  return (
    <MainView>
      <Text style={styles.title}>Home Screen</Text>
    </MainView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LostAndFoundScreen;
