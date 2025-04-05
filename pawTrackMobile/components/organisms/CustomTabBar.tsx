import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign, Feather, Octicons, Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { theme } from '@/components/Themed';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
const CustomTabBar: React.FC<BottomTabBarProps> = () => {
  return (
    <Tabs>
    <TabSlot />
    <TabList>
      <TabTrigger name="home">
        <Text>Home</Text>
      </TabTrigger>
      <TabTrigger name="messages">
        <Text>Article</Text>
      </TabTrigger>
    </TabList>
  </Tabs>
  );
};

const getIcon = (name: string, color: string) => {
  switch (name) {
    case 'index':
      return <AntDesign name="home" size={24} color={color} />;
    case 'messages':
      return <AntDesign name="message1" size={24} color={color} />;
    case 'lostAndFound':
      return <Octicons name="apps" size={24} color={color} />;
    case 'pets':
      return <Ionicons name="paw-outline" size={24} color={color} />;
    case 'profile':
      return <Feather name="user" size={24} color={color} />;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.beige,
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
});

export default CustomTabBar;
