import React from 'react';
import { AntDesign, Feather, Octicons, Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { theme } from '@/components/Themed';
import HeaderText from '@/components/atoms/HeaderText';
import HeaderIcons from '@/components/atoms/HeaderIcons';
import BackIcon from '@/components/atoms/BackIcon';
import { useSession } from '@/context';
import { Text as LoadingText } from '@/components/Themed';

export default function TabLayout() {
  const headerShown = useClientOnlyValue(false, true)
  const { user, isLoading } = useSession();
  if(isLoading) {
    return <LoadingText>Loading...</LoadingText>
  };

  if(!user)
  {
    return <Redirect href="/sign-in" />
  };

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
        name='index'
        options={{
          title: 'Home',
          animation: 'fade',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Paw Track'}/>,
          headerRight: () => <HeaderIcons searchSelected={false} addSelected={false} />,
          tabBarIcon: ({ color } : any) => <AntDesign name='home' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='messages/index'
        options={{
          title: 'Messages',
          animation: 'fade',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Messages'}/>,
          headerRight: () => <HeaderIcons searchSelected={false} addSelected={false} />,
          tabBarIcon: ({ color }: any) => <AntDesign name='message1' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='lostAndFound/index'
        options={{
          title: 'Forum',
          animation: 'fade',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Lost&Found'}/>,
          headerRight: () => <HeaderIcons searchSelected={false} addSelected={false} />,
          tabBarIcon: ({ color }: any) => <Octicons name='apps' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='pets/index'
        options={{
          title: 'Pets',
          animation: 'fade',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Pets'}/>,
          headerRight: () => <HeaderIcons searchSelected={false} addSelected={false} />,
          tabBarIcon: ({ color }: any) =><Ionicons name='paw-outline' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile/index'
        options={{
          title: 'Profile',
          animation: 'fade',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderText text={'Profile'}/>,
          headerRight: () => <HeaderIcons searchSelected={false} addSelected={false} />,
          tabBarIcon: ({ color }: any) => <Feather name='user' size={28} color={color} />,
        }}
      />
    
      <Tabs.Screen
        name='addTask/index'
        options={{
          href: null,
          animation: 'fade',
          headerTitleAlign: 'left',
          headerLeft: () => <BackIcon />,
          headerTitle: () => <HeaderText text={'Add Task'}/>,
          headerRight: () => <HeaderIcons searchSelected={false} addSelected={true} />,
        }}
      />
      <Tabs.Screen
        name="searchVet/index"
        options={{
          href: null,
          animation: 'fade',
          headerTitleAlign: 'left',
          headerLeft: () => <BackIcon />,
          headerTitle: () => <HeaderText text={'Search vet offices'}/>,
          headerRight: () => <HeaderIcons searchSelected={true} addSelected={false} />,
        }}
      />
    </Tabs>
  );
}
