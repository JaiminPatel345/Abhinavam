import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Stack, useLocalSearchParams} from 'expo-router';
import ProfileComponent from '@/components/ui/ProfileComponent';
import {fetchUserById, fetchUserPosts} from '@/services/userService';
import {IUser} from '@/types/user.types';
import {IPost} from '@/types/posts.types';

export default function UserProfileScreen() {
  const {username} = useLocalSearchParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [userPosts, setUserPosts] = useState<IPost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [username]);

  const loadUserData = async () => {
    if (!username) return;

    setIsLoading(true);
    try {
      // Fetch user data
      const userData = await fetchUserById(username as string);
      setUser(userData);

      // Fetch initial posts
      const postsData = await fetchUserPosts(username as string, 1);

      setUserPosts(postsData.posts);
      setHasMore(postsData.hasMore);
      setPage(1);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadUserData();
  };

  const fetchMorePosts = async () => {
    if (!hasMore || isLoading || !username) return;

    try {
      const nextPage = page + 1;
      const postsData = await fetchUserPosts(username as string, nextPage);


      if (postsData.posts.length > 0) {
        setUserPosts(prev => prev ? [...prev, ...postsData.posts] : postsData.posts);
        setPage(nextPage);
        setHasMore(postsData.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  const handleViewAvatar = () => {
    // Navigate to full-screen avatar view
    if (user?.avatar?.url) {
      // Implementation depends on your navigation setup
      // For example: router.push(`/users/${id}/avatar`);
    }
  };

  if (!username) {
    return (
        <View style={styles.container}>
          <Text style={styles.errorText}>User ID not provided</Text>
        </View>
    );
  }

  if (isLoading && !user) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#5C7AEA"/>
        </View>
    );
  }

  return (
      <>
        <Stack.Screen options={{
          title: user?.username || 'User Profile',
          headerBackTitle: 'Back'
        }}/>

        {user ? (
            <ProfileComponent
                user={user}
                userPosts={userPosts}
                isLoading={isLoading}
                isOwnProfile={false}
                onRefresh={handleRefresh}
                fetchNewPosts={fetchMorePosts}
                onViewAvatar={handleViewAvatar}
            />
        ) : (
            <View style={styles.container}>
              <Text style={styles.errorText}>User not found</Text>
            </View>
        )}
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5C5C',
  }
});