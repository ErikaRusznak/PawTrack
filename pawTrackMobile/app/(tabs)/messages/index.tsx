import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';

const MessagesScreen = () => {
  return (
    <MainView>
      <Text style={styles.title}>Messages Screen</Text>
    </MainView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MessagesScreen;