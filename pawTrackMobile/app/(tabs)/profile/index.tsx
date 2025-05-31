import { StyleSheet, View } from 'react-native';
import ProfileInfo from '@/components/organisms/ProfileInfo';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '@/src/User';
import { countPetsForUser } from '@/src/Pets';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [petsCount, setPetsCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                if (!id) throw new Error('User ID not found in storage');

                const profile = await getUserProfile(id);
                if (!profile) throw new Error('User profile not found');

                setUser(profile);

                const petsCount = await countPetsForUser(id);
                setPetsCount(petsCount);
            } catch (e) {
                Toast.show({ type: 'error', text1: 'Failed to load profile' });
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        void fetchUserProfile();
    }, []);



    return (
        <View style={styles.main}>
            <ProfileInfo user={user} loading={loading} petsCount={petsCount ?? 0} />
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
