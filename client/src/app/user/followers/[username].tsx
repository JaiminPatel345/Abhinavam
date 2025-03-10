import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/types/redux.types';
import styles from "@css/styles/profileStyles";
import UserListComponent from "@/components/ui/UserListComponent";
import PullToRefreshList from "@/components/PullToRefreshList";
import {UserRelation} from "@/types/follow.types";
import {fetchFollowers, toggleFollow} from "@/services/followServices";
import {showNotification} from "@/redux/slice/notificationSlice";
import {
  clearUserFollowers,
  toggleUserFollow,
  updateFollowers
} from "@/redux/slice/userSlice";
import {IFetchFollowers} from "@/types/response.types";

export default function FollowersPage() {
  const {username} = useLocalSearchParams<{ username: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followers, setFollowers] = useState<UserRelation[]>([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState<boolean>(false)
  const [isToggleFollowLoading, setIsToggleLoading] = useState<boolean>(false)
  const userFollowers = useSelector((state: RootState) => state.user.userFollowers);


  const {user: currentUser} = useSelector((state: RootState) => state.user);

  const callService = async () => {
    try {
      const data: IFetchFollowers = await fetchFollowers(username);
      setFollowers(data.followers);
      dispatch(updateFollowers(data.followers));
    } catch (error: any) {
      dispatch(showNotification({
        message: error.message || 'Unknown error occurred',
        title: 'Error',
        type: 'DANGER'
      }))
    } finally {
      setIsLoadingFollowers(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {

    if (username) {
      callService()
    }
  }, [username]);

  const handleRefresh = async () => {
    if (username) {
      setIsRefreshing(true);
      dispatch(clearUserFollowers());
      callService()
    }
  };

  const handleFollowToggle = async (userToFollow: string) => {
    setIsToggleLoading(true);
    dispatch(toggleUserFollow(userToFollow))
    toggleFollow(userToFollow)
        .catch((error) => {
          dispatch(showNotification({
            message: error.message || 'Unknown error occurred',
            title: 'Error',
            type: 'DANGER'
          }))
        })
        .finally(() => {
          setIsToggleLoading(false);
          setIsLoadingFollowers(false)
        })
  };

  const handleUserPress = (pressedUsername: string) => {
    router.push(`/user/${pressedUsername}`);
  };

  return (
      <View style={styles.container}>
        <PullToRefreshList
            data={followers}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => (
                <UserListComponent
                    user={item}
                    isCurrentUser={item.username === currentUser?.username}
                    onFollowToggle={handleFollowToggle}
                    onUserPress={handleUserPress}
                    isCurrUserFollowing={userFollowers[item._id]}
                    toggleLoading={isToggleFollowLoading}
                />
            )}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            isLoading={isLoadingFollowers}
            emptyText="No followers yet"
        />
      </View>
  );
}