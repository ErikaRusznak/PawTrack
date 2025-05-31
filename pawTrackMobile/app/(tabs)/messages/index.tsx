import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, Image, View as RNView, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, getChatsForUser } from '@/src/Chat';
import { getUserProfile } from '@/src/User';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { TextMedium, TextRegular } from '@/components/StyledText';

const MessagesScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      if (!id) return;
      const chatsData = await getChatsForUser(id);
      setChats(chatsData);

      const profiles: { [key: string]: any } = {};
      for (const chat of chatsData) {
        const otherUserId = chat.users.find((u: string) => u !== id);
        if (otherUserId && !profiles[otherUserId]) {
          profiles[otherUserId] = await getUserProfile(otherUserId);
        }
      }
      setUserProfiles(profiles);
      setLoading(false);
    };
    fetchChats();
  }, []);

  const filteredChats = chats.filter(chat => {
    const otherUserId = chat.users.find((u: string) => u !== userId);
    const profile = userProfiles[otherUserId];
    const name = profile ? `${profile.firstName} ${profile.lastName}`.toLowerCase() : '';
    return name.includes(search.toLowerCase());
  });

  function getLastMessageTime(date: Date | string) {
    const now = new Date();
    const msgDate = typeof date === 'string' ? new Date(date) : date;
    const isToday =
      now.getDate() === msgDate.getDate() &&
      now.getMonth() === msgDate.getMonth() &&
      now.getFullYear() === msgDate.getFullYear();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      yesterday.getDate() === msgDate.getDate() &&
      yesterday.getMonth() === msgDate.getMonth() &&
      yesterday.getFullYear() === msgDate.getFullYear();
    if (isToday) {
      return format(msgDate, 'HH:mm');
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return format(msgDate, 'd MMM');
    }
  }

  const renderChat = ({ item }: { item: Chat }) => {
    const otherUserId = item.users.find((u: string) => u !== userId);
    const profile = userProfiles[otherUserId!!];
    const name = `${profile.firstName} ${profile.lastName}`;
    const picture = profile.picture ? { uri: profile.picture } : require('@/assets/images/icon.png');
    const lastMessageTime = getLastMessageTime(item.lastMessageSentAt);
    return (
      <TouchableOpacity style={styles.chatCard}>
        <Image source={picture} style={styles.avatar} />
        <RNView style={{ flex: 1 }}>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextMedium style={styles.name}>{name}</TextMedium>
            <TextRegular style={styles.time}>{lastMessageTime}</TextRegular>
          </RNView>
          <TextRegular style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</TextRegular>
        </RNView>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#d98324" />
        <TextRegular style={{ color: '#7B6F52', marginTop: 16 }}>Loading messages...</TextRegular>
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <RNView style={styles.searchContainer}>
        <Ionicons name="search" size={22} color="#7B6F52" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#7B6F52"
          value={search}
          onChangeText={setSearch}
        />
      </RNView>
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderChat}
        contentContainerStyle={{ paddingTop: 20 }}
        ListEmptyComponent={() => (
          <TextRegular style={{ textAlign: 'center', color: '#7B6F52' }}>No chats found.</TextRegular>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6E7B5',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginTop: 10,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#7B6F52',
    fontFamily: 'Montserrat-Regular',
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7B6F52',
    fontFamily: 'Montserrat-SemiBold',
  },
  lastMessage: {
    fontSize: 15,
    color: '#7B6F52',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    color: '#7B6F52',
    fontFamily: 'Montserrat-Regular',
    marginLeft: 10,
  },
});

export default MessagesScreen;