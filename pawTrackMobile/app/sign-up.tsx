

import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';
import { useSession } from '@/context';

const SignUpScreen =()  => {
  const { signUp } = useSession();
  
  return (
    <MainView>
      <Text style={styles.title}>Sign up Screen</Text>
    </MainView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
