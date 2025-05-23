import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '@/context/AuthContext';
import { TextMedium } from '@/components/StyledText';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';

const ProfileScreen = () => {

  const { signOut } = useSession();

  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
        <TextMedium style={styles.logoutText}>Logout</TextMedium>
      </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: "#d98324",
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: "#f2f6d0",
  },
});

export default ProfileScreen;
