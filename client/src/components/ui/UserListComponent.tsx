// components/profile/UserListComponent.tsx
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from "@css/styles/profileStyles"


interface UserRelation {
  _id: string;
  username: string;
  name: string;
  avatar?: {
    url: string,
    public_id: string
  };
}

interface UserListComponentProps {
  user: UserRelation;
  isCurrentUser: boolean;
  onFollowToggle: (userId: string) => void;
  onUserPress: (username: string) => void;
  isCurrUserFollowing: boolean;
  toggleLoading: boolean;
}

const UserListComponent: React.FC<UserListComponentProps> = ({
                                                               user,
                                                               isCurrentUser,
                                                               onFollowToggle,
                                                               onUserPress,
                                                               isCurrUserFollowing,
                                                               toggleLoading,

                                                             }) => {
  return (
      <TouchableOpacity
          style={styles.userItem}
          onPress={() => onUserPress(user.username)}
      >
        {/* Avatar */}
        <Image
            source={{uri: user.avatar?.url || 'default-avatar-url'}}
            style={styles.avatar}
        />

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>

        {/* Follow Button (if not current user) */}
        {!isCurrentUser &&
        toggleLoading ? (
            <View
                style={isCurrUserFollowing ? styles.unFollowButton : styles.followButton}
            >
              <ActivityIndicator size="small" color="#fff"/>
            </View>
        ) : (
            <TouchableOpacity
                style={isCurrUserFollowing ? styles.unFollowButton : styles.followButton}
                onPress={() => onFollowToggle(user._id)}
            >
              {isCurrUserFollowing ? (
                  <Text style={styles.followButtonText}>
                    Unfollow
                  </Text>
              ) : (<Text style={styles.followButtonText}>
                Follow
              </Text>)}
            </TouchableOpacity>
        )
        }
      </TouchableOpacity>
  );
};

export default UserListComponent;