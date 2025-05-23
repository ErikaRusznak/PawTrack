import { StyleSheet, TouchableOpacity } from 'react-native';
import MainView from '@/components/templates/MainView';
import { useSession } from '@/context/AuthContext';
import { TextMedium } from '@/components/StyledText';

const ProfileScreen = () => {
  
  const { signOut } = useSession();

  return (
    <MainView>
      <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
        <TextMedium style={styles.logoutText}>Logout</TextMedium>
      </TouchableOpacity>
    </MainView>
  );
};

const styles = StyleSheet.create({
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
