// components/profile/UserListComponent.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
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
  onFollowToggle: (username: string) => void;
  onUserPress: (username: string) => void;
}

const UserListComponent: React.FC<UserListComponentProps> = ({
  user,
  isCurrentUser,
  onFollowToggle,
  onUserPress
}) => {
  return (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => onUserPress(user.username)}
    >
      {/* Avatar */}
      <Image
        source={{ uri: user.avatar?.url || 'default-avatar-url' }}
        style={styles.avatar}
      />

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>

      {/* Follow Button (if not current user) */}
      {!isCurrentUser && (
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => onFollowToggle(user.username)}
        >
          <Text style={styles.followButtonText}>
            Follow
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default UserListComponent;