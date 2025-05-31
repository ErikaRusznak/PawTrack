import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { TextMedium } from '@/components/StyledText';
import { useSession } from '@/context/AuthContext';
import { getTheme, Text } from '@/components/Themed';
import { FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';

type ProfileInfoProps = {
    user: any;
    loading: boolean;
    petsCount: number;
    showLogoutButton?: boolean;
}

const ProfileInfo = ({ user, loading, petsCount, showLogoutButton = true }: ProfileInfoProps) => {
    const theme = getTheme();
    const { signOut } = useSession();
    const [imageLoading, setImageLoading] = useState(true);

console.log("user", user);
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.orange} />
                <Text>Loading profile...</Text>
            </View>
        );
    }
    return (
        <View style={[styles.container, showLogoutButton ? {gap: 32} : {gap: 0}]}>
            {user?.picture && (
                <View style={{ position: 'relative' }}>
                    {imageLoading && (
                        <ActivityIndicator
                            size="small"
                            color={theme.orange}
                            style={{ position: 'absolute', top: '40%', left: '20%', zIndex: 1 }}
                        />
                    )}
                    <Image
                        source={{ uri: user.picture }}
                        style={styles.avatar}
                        onLoad={() => setImageLoading(false)}
                    />
                </View>
            )}

            <View style={styles.infoBlock}>
                <View style={styles.infoRow}>
                    <FontAwesome5 name="user" size={18} color="#443627" />
                    <TextMedium style={styles.infoText}>
                        {user?.firstName} {user?.lastName}
                    </TextMedium>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="calendar" size={20} color="#443627" />
                    <TextMedium style={styles.infoText}>
                        {user?.age} years old
                    </TextMedium>
                </View>
                <View style={styles.infoRow}>
                    <Entypo name="location-pin" size={20} color="#443627" />
                    <TextMedium style={styles.infoText}>
                        {user?.county}
                    </TextMedium>
                </View>
                <View style={styles.infoRow}>
                    <FontAwesome5 name="paw" size={18} color="#443627" />
                    <TextMedium style={styles.infoText}>
                        {petsCount} animals
                    </TextMedium>
                </View>
                {user?.phoneNumber && (
                    <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${user.phoneNumber}`)}>
                        <MaterialCommunityIcons name="phone" size={20} color="#1e88e5" />
                        <TextMedium style={[styles.infoText, { color: '#1e88e5', textDecorationLine: 'underline' }]}>
                            {user.phoneNumber}
                        </TextMedium>
                    </TouchableOpacity>
                )}
            </View>
            {showLogoutButton &&
                <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
                    <TextMedium style={styles.logoutText}>Sign out</TextMedium>
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        color: "#443627",
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
