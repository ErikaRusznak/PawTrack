import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import ProfileInfo from '@/components/organisms/ProfileInfo';

const ProfileScreen = () => {
  return (
      <View style={styles.main}>
          <ProfileInfo />
      </View>
  );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default ProfileScreen;
