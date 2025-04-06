import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';

const ProfileScreen = () => {
  return (
    <MainView>
      <Text style={styles.title}>Home Screen</Text>
      LOGOUT
    </MainView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
