import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/types/redux.types';
import styles from "@css/styles/profileStyles";
import {
  fetchFollowersThunk,
  toggleFollowUserThunk,
} from "@/redux/thunks/followThunk";
import UserListComponent from "@/components/ui/UserListComponent";

export default function FollowersPage() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    followers,
    isLoadingFollowers
  } = useSelector((state: RootState) => state.follow);

  const { user: currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (username) {
      dispatch(fetchFollowersThunk(username));
    }
  }, [username]);

  const handleFollowToggle = (userToFollow: string) => {
    dispatch(toggleFollowUserThunk(userToFollow));
  };

  const handleUserPress = (pressedUsername: string) => {

    router.push(`/user/${pressedUsername}`);
  };

  if (isLoadingFollowers) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading followers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserListComponent
            user={item}
            isCurrentUser={item.username === currentUser?.username}
            onFollowToggle={handleFollowToggle}
            onUserPress={handleUserPress}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No followers yet</Text>
          </View>
        }
      />
    </View>
  );
}