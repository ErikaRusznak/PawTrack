import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Post } from '@/src/LostAndFoundPost';
import { formatDate, formatTime } from '@/util/HelperFunctions';
import { TextMedium, TextRegular, TextSemiBold } from '../StyledText';
import { getTheme } from "@/components/Themed";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FoundPopupModal from '../moleculas/FoundPopupModal';


type LostAndFoundPostCardProps = {
  post: Post;
}

const LostAndFoundPostCard = ({ post }: LostAndFoundPostCardProps) => {
  const theme = getTheme();
  const [expanded, setExpanded] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [postImageLoading, setPostImageLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [foundModalVisible, setFoundModalVisible] = useState(false);

  React.useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    })();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarWrapper}>
          {avatarLoading && <ActivityIndicator style={styles.avatarLoader} size="small" color={theme.orange} />}
          <Image
            source={post.userPicture ? { uri: post.userPicture } : require('@/assets/images/icon.png')}
            style={styles.avatar}
            onLoadStart={() => setAvatarLoading(true)}
            onLoadEnd={() => setAvatarLoading(false)}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TextMedium style={styles.name}>{post.userFirstName} {post.userLastName}</TextMedium>
          <TextRegular style={styles.date}>{formatDate(post.createdAt)} {formatTime(post.createdAt)}</TextRegular>
        </View>
        {userId !== post.userId && (
          <TouchableOpacity onPress={() => setFoundModalVisible(true)}>
            <View style={[styles.foundButton, !post.found && styles.notFoundButton]}>
              <TextRegular style={styles.foundText}>{post.found ? 'Found' : 'Contact owner here'}</TextRegular>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {post.picture && (
        <View style={styles.postImageWrapper}>
          {postImageLoading && (
            <ActivityIndicator style={styles.imageLoader} size="large" color="#d98324" />
          )}
          <Image
            source={{ uri: post.picture }}
            style={styles.postImage}
            resizeMode="cover"
            onLoadStart={() => setPostImageLoading(true)}
            onLoadEnd={() => setPostImageLoading(false)}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.titleRow}
        onPress={() => setExpanded((e) => !e)}
        activeOpacity={0.7}
      >
        <TextSemiBold style={styles.title}>{post.title}</TextSemiBold>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color="#443627" />
      </TouchableOpacity>
      {expanded && (
        <TextRegular style={styles.details}>{post.details}</TextRegular>
      )}
      <FoundPopupModal
        visible={foundModalVisible}
        onClose={() => setFoundModalVisible(false)}
        post={post}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
    marginHorizontal: 1,
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  avatarLoader: {
    position: 'absolute',
    zIndex: 1,
  },
  postImageWrapper: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 0,
  },
  avatar: {
    width: 41,
    height: 38,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: '#443627',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  foundButton: {
    backgroundColor: '#f7c873',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 8,
  },
  notFoundButton: {
    backgroundColor: '#ffa3a3',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 8,
  },
  foundText: {
    color: '#443627',
    fontWeight: 'bold',
    fontSize: 13,
  },
  postImage: {
    width: '100%',
    height: 120,
    marginTop: 10,
    marginBottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#443627',
    flex: 1,
  },
  details: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    color: '#443627',
    fontSize: 15,
  },
});

export default LostAndFoundPostCard;
