import {StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, View} from 'react-native';
import {getTheme} from '@/components/Themed';
import { TextMedium, TextRegular } from '@/components/StyledText';
import Feather from '@expo/vector-icons/build/Feather';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '@/src/User';
import CountiesDropdownModal from '@/components/atoms/CountiesDropdownModal';
import { router } from 'expo-router';
import LostAndFoundPostCard from '@/components/organisms/LostAndFoundPostCard';
import { Post, getPosts } from '@/src/LostAndFoundPost';
import { useFocusEffect } from '@react-navigation/native';

const LostAndFoundScreen = () => {

  const theme = getTheme();
  const [countiesDropdownVisible, setCountiesDropdownVisible] = useState<boolean>(false);
  const [countySelected, setCountySelected] = useState<string>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const setInitialData = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (!id) throw new Error('User ID not found in storage');

    const profile = await getUserProfile(id);
    if (!profile) return;
    setCountySelected(profile.county);
  }

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsData = await getPosts(countySelected);
      setPosts(postsData);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setInitialData();
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if (countySelected) fetchPosts();
    }, [countySelected])
  );

  const addPost = () => {
    router.replace("/(tabs)/lostAndFound/add" as any);
  };

  return (
    <View style={styles.main}>
      <View style={styles.filterAndAdd}>
        <TouchableOpacity style={styles.countyFilter} onPress={() => setCountiesDropdownVisible(true)}>
          <TextRegular style={styles.countyText}>{countySelected}</TextRegular>
          <Feather name="chevron-down" size={20} color={theme.brown} />
        </TouchableOpacity>
        <TouchableOpacity onPress={addPost} style={styles.addPostButton}>
          <TextMedium style={styles.addPostText}>Add post</TextMedium>
        </TouchableOpacity>
        <CountiesDropdownModal
          visible={countiesDropdownVisible}
          onClose={() => setCountiesDropdownVisible(false)}
          onSelect={(county) => setCountySelected(county)}
        />
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={theme.orange} />
              <TextMedium>Loading posts...</TextMedium>
            </View>
        ) : (
            <>
              {posts.length === 0 && (
                  <TextMedium style={styles.noPosts}>No tasks in this county.</TextMedium>
              )}
              <FlatList
                  data={posts}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                      <LostAndFoundPostCard post={item} />
                  )}
                  showsVerticalScrollIndicator={false}
              />
            </>
        )}
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  filterAndAdd: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countyFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countyText: {
    fontSize: 28,
    color: '#443627',
    marginRight: 6,
  },
  addPostButton: {
    backgroundColor: "#d98324",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  addPostText: {
    color: "#f2f6d0",
    fontSize: 20,
  },
  noPosts: {
    textAlign: 'center',
    color: '#999',
    fontSize: 18,
    marginTop: 4,
  },
});

export default LostAndFoundScreen;
