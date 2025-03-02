import React from 'react';
import {router, Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import CreatePostButton from "@components/ui/CreatePostButton";

export default function TabLayout() {
  return (
      <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#4C585B',
            tabBarInactiveTintColor: '#A5BFCC',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerStyle: {
              backgroundColor: '#F4EDD3',
            },
            headerShadowVisible: false,
            headerTintColor: '#4C585B',
            headerTitleStyle: {
              fontFamily: 'Abhinavam-Logo',
              fontSize: 24,
              fontWeight: '400',
            },
            headerTitleAlign: 'center',
          }}
      >
        <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({color}) => <Ionicons name="home" size={24}
                                                 color={color}/>,
            }}
        />

        <Tabs.Screen
            name="createTab"
            // This component will never be rendered
            listeners={{
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                // Navigate to create post screen
                router.push('/posts/create');
              },
            }}
            options={{
              title: 'Create',
              tabBarButton: (props) => <CreatePostButton/>,
            }}
        />


        <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({color}) => <Ionicons name="person" size={24}
                                                 color={color}/>,
            }}
        />
      </Tabs>
  );
}