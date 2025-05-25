import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TextBold, TextMedium } from '@/components/StyledText';
import { useSession } from '@/context/AuthContext';
import { getTheme } from '@/components/Themed';
import { FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '@/src/User';
import {countPetsForUser} from "@/src/Pets";

const ProfileInfo = () => {
    const theme = getTheme();
    const { signOut } = useSession();
    const [user, setUser] = useState<any>(null);
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
                if (!petsCount) throw new Error('Pets count not found');

                setPetsCount(petsCount);
            } catch (e) {
                Toast.show({ type: 'error', text1: 'Failed to load profile' });
                console.error(e);
            }
        };

        void fetchUserProfile();
    }, []);

    return (
        <View style={styles.container}>
            {user?.picture && (
                <Image source={{ uri: user.picture }} style={styles.avatar} />
            )}

            <View style={styles.infoBlock}>
                <View style={styles.infoRow}>
                    <FontAwesome5 name="user" size={18} color="black" />
                    <TextMedium style={styles.infoText}>
                        {user?.firstName} {user?.lastName}
                    </TextMedium>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="calendar" size={20} color="black" />
                    <TextMedium style={styles.infoText}>
                        {user?.age} years old
                    </TextMedium>
                </View>
                <View style={styles.infoRow}>
                    <Entypo name="location-pin" size={20} color="black" />
                    <TextMedium style={styles.infoText}>
                        {user?.county}
                    </TextMedium>
                </View>
                <View style={styles.infoRow}>
                    <FontAwesome5 name="paw" size={18} color="black" />
                    <TextMedium style={styles.infoText}>
                        {petsCount} animals
                    </TextMedium>
                </View>
            </View>

            <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
                <TextMedium style={styles.logoutText}>Logout</TextMedium>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 80,
        marginBottom: 22,
    },
    infoBlock: {
        gap: 16,
        marginVertical: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#d98324',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
        width: '100%',
    },
    logoutText: {
        color: '#f2f6d0',
    },
});

export default ProfileInfo;
