// src/components/TabBar.tsx
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Route, usePathname, useRouter, useSegments} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";

// Import from your app's router types or define a more generic type

type TabItem = {
  name: string;
  route: Route;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const showTabBar = useSelector((state:RootState) => state.navigation.showTabBar);

  const tabs: TabItem[] = [
    {
      name: 'Home',
      route: '/',
      icon: 'home-outline',
      activeIcon: 'home'
    },
    {
      name: 'Create',
      route: '/posts/create',
      icon: 'add-circle-outline',
      activeIcon: 'add-circle'
    },
    {
      name: 'Profile',
      route: '/profile',
      icon: 'person-outline',
      activeIcon: 'person'
    }
  ];

  const isActive = (route: Route): boolean => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  const handleNavigation = (route: Route) => {
    router.navigate(route);
  };

  if(!showTabBar){
    return null;
  }

  return (
      <View style={styles.container}>
        {tabs.map((tab) => (
            <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => handleNavigation(tab.route)}
            >
              <Ionicons
                  name={isActive(tab.route) ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive(tab.route) ? '#007AFF' : '#8E8E93'}
              />
              <Text
                  style={[
                    styles.tabText,
                    {color: isActive(tab.route) ? '#007AFF' : '#8E8E93'}
                  ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  // Same styles as before
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingBottom: 25,
    paddingTop: 10
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabText: {
    fontSize: 12,
    marginTop: 4
  }
});