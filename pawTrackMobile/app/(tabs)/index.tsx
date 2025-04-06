import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';
import EditScreenInfo from '@/components/EditScreenInfo';

const HomeScreen =()  => {
  return (
    <MainView>
      <Text style={styles.title}>Home Screen</Text>
      <EditScreenInfo />
    </MainView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
