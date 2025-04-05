import React from 'react';
import { AntDesign, Feather, Octicons, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { theme } from '@/components/Themed';
import HeaderText from '@/components/atoms/HeaderText';
import HeaderIcons from '@/components/atoms/HeaderIcons';

export default function TabLayout() {
  const headerShown = useClientOnlyValue(false, true)
  console.log("g", theme.beige)
  return (
    <Tabs
      screenOptions={{
        headerShown: headerShown,
        headerStyle: {
          backgroundColor: theme.beige, 
        },
        tabBarActiveTintColor: theme.orange,
        tabBarInactiveTintColor: theme.brown,
        tabBarStyle: {
          backgroundColor: theme.beige,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Paw Track'}/>,
          headerRight: () => <HeaderIcons />,
          tabBarIcon: ({ color } : any) => <AntDesign name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Messages'}/>,
          headerRight: () => <HeaderIcons />,
          tabBarIcon: ({ color }: any) => <AntDesign name="message1" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lostAndFound"
        options={{
          title: 'Forum',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Lost&Found'}/>,
          headerRight: () => <HeaderIcons />,
          tabBarIcon: ({ color }: any) => <Octicons name="apps" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Pets'}/>,
          headerRight: () => <HeaderIcons />,
          tabBarIcon: ({ color }: any) =><Ionicons name="paw-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Profile'}/>,
          headerRight: () => <HeaderIcons />,
          tabBarIcon: ({ color }: any) => <Feather name="user" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
