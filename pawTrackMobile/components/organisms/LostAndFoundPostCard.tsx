import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Post } from '@/src/LostAndFoundPost';
import { formatDate, formatTime } from '@/util/HelperFunctions';
import { TextMedium, TextRegular, TextSemiBold } from '../StyledText';


type LostAndFoundPostCardProps = {
  post: Post;
}

const LostAndFoundPostCard = ({ post } : LostAndFoundPostCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={post.userPicture ? { uri: post.userPicture } : require('@/assets/images/icon.png')}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <TextMedium style={styles.name}>{post.userFirstName} {post.userLastName}</TextMedium>
          <TextRegular style={styles.date}>{formatDate(post.createdAt)} {formatTime(post.createdAt)}</TextRegular>
        </View>
        <View style={styles.foundBadge}>
          <TextRegular style={styles.foundText}>{post.found ? 'Found' : 'qFound'}</TextRegular>
        </View>
      </View>
      {post.picture && (
        <Image source={{ uri: post.picture }} style={styles.postImage} resizeMode="cover" />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 0,
  },
  avatar: {
    width: 36,
    height: 36,
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
  foundBadge: {
    backgroundColor: '#f7c873',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 8,
  },
  foundText: {
    color: '#a05a00',
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
