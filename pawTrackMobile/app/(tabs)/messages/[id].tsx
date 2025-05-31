import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, View, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { getUserProfile } from '@/src/User';
import { getMessagesForChatByKey } from '@/src/Message';
import { Chat, getChatsForUser } from '@/src/Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import MessageBubble from '@/components/moleculas/MessageBubble';
import { TextMedium, TextRegular } from '@/components/StyledText';
import ProfileInfo from '@/components/organisms/ProfileInfo';
import { countPetsForUser } from '@/src/Pets';

const MessagesDetailScreen = () => {
    const { id } = useLocalSearchParams(); // id = chatKey
    const [messages, setMessages] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [otherProfile, setOtherProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const flatListRef = useRef(null);
    const [petsCount, setPetsCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return setLoading(false);
            setUserId(userId);

            const chats = await getChatsForUser(userId);
            const foundChat = chats.find((c: any) => c.chatKey === id);
            if (!foundChat) return setLoading(false);

            const otherId = (foundChat as Chat).users.find((u: string) => u !== userId);
            setUserProfile(await getUserProfile(userId));
            setOtherProfile(otherId ? await getUserProfile(otherId) : null);

            const petsCount = await countPetsForUser(otherId!!);
            setPetsCount(petsCount);

            const msgs = await getMessagesForChatByKey(foundChat.chatKey);
            setMessages(msgs);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const renderDateSeparator = (date: string) => (
        <View style={{ alignSelf: 'center', width: '100%', alignItems: 'center', marginVertical: 12, justifyContent: 'center' }}>
            <TextRegular style={{ color: '#443627', fontSize: 16 }}>{date}</TextRegular>
        </View>
    );

    let lastDate = '';
    const renderItem = ({ item }) => {
        const isOwn = item.sentByUser === userId;
        const msgDate = moment(item.sentAt);
        const timeLabel = msgDate.format('HH:mm');
        const dateLabel = msgDate.isSame(moment(), 'day') ? 'Today' : msgDate.format('D MMMM');
        let showDate = false;
        if (dateLabel !== lastDate) {
            lastDate = dateLabel;
            showDate = true;
        }
        return (
            <>
                {showDate && renderDateSeparator(dateLabel + (item.text ? ` ${timeLabel}` : ''))}
                <MessageBubble message={item} isOwn={isOwn} profile={isOwn ? userProfile : otherProfile} />
            </>
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#d98324" />
                <TextRegular style={{ color: '#7B6F52', marginTop: 16 }}>Loading conversation...</TextRegular>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Modal
                visible={profileModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setProfileModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setProfileModalVisible(false)}
                    style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { }}
                        style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 }}
                    >
                        <ProfileInfo user={otherProfile} loading={!otherProfile} petsCount={petsCount ?? 0} showLogoutButton={false} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            <View style={styles.header}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => setProfileModalVisible(true)}>
                    <Image source={otherProfile?.picture ? { uri: otherProfile.picture } : require('@/assets/images/icon.png')} style={styles.avatar} />
                    <TextMedium style={styles.headerName}>{otherProfile ? `${otherProfile.firstName} ${otherProfile.lastName}` : ''}</TextMedium>
                </TouchableOpacity>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#e5e5e5',
        marginBottom: 8,
    },
    headerName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#443627',
        marginLeft: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#eee',
    },


});

export default MessagesDetailScreen;
