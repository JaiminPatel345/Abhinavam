import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {Divider} from "react-native-paper";
import {Camera, Edit2,} from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import SinglePost from '@/app/posts/SinglePost';
import {IPost} from "@/types/posts.types";
import {IUser} from "@/types/user.types";
import {router} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/types/redux.types";
import {toggleFollowUserThunk} from "@/redux/thunks/followThunk";

interface ProfileComponentProps {
  user: IUser;
  userPosts: IPost[] | null;
  isLoading: boolean;
  isImageUploading?: boolean;
  isOwnProfile: boolean;
  onRefresh: () => void;
  fetchNewPosts: () => void;
  onEditAvatar?: () => void;
  onViewAvatar?: () => void;
  onEditTagline?: () => void;
  onEditAbout?: () => void;
  onEditInterests?: () => void;
  onEditProfessions?: () => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
                                                             user,
                                                             userPosts,
                                                             isLoading,
                                                             isImageUploading = false,
                                                             isOwnProfile,
                                                             onRefresh,
                                                             fetchNewPosts,
                                                             onEditAvatar,
                                                             onViewAvatar,
                                                             onEditTagline,
                                                             onEditAbout,
                                                             onEditInterests,
                                                             onEditProfessions,
                                                           }) => {

  const [isFollow , setIsFollow] = React.useState(false);
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const handleShowFollowers = () => {
    router.push(`/user/followers/${user.username}`);
  };

  const handleShowFollowing = () => {
    router.push(`/user/following/${user.username}`);
  };

  const handleFollowUser = () => {
    // Implement follow user functionality
    dispatch(toggleFollowUserThunk(user._id));
    setIsFollow(!isFollow);

  }


  // Profile Info Section
  const renderProfileInfo = () => (
      <>
        <View style={styles.profileHeader}>
          <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={isOwnProfile ? onEditAvatar : onViewAvatar}
              disabled={!onEditAvatar && !onViewAvatar}
          >
            <Image
                source={{uri: user?.avatar?.url || 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png'}}
                style={styles.profileImage}
            />
            {isImageUploading && (
                <View style={styles.uploadingOverlay}>
                  <Progress.Circle size={40} indeterminate={true}
                                   color="#ffffff" borderWidth={2}/>
                </View>
            )}
            {isOwnProfile && (
                <View style={styles.editImageButton}>
                  <Camera size={16} color="#FFFFFF"/>
                </View>
            )}
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View className={'flex-1 justify-between flex-row'}>
              <Text style={styles.userName}>{user?.username}</Text>
              {!isOwnProfile && (
                  <TouchableOpacity className={`${isFollow ? 'bg-red-400' : 'bg-cyan-200'} rounded-md`}
                                    onPress={handleFollowUser}>
                    <Text style={{color: '#5C7AEA'}}
                          className={'p-2 rounded'}>{isFollow ? 'Unfollow' : 'Follow'}</Text>
                  </TouchableOpacity>
              )}
            </View>

            <View style={styles.taglineContainer}>
              {user?.tagline ? (
                  <Text style={styles.tagline}>{user.tagline}</Text>
              ) : (
                  <Text style={styles.emptyTagline}>
                    {isOwnProfile ? 'Add a tagline' : 'No tagline'}
                  </Text>
              )}
              {isOwnProfile && onEditTagline && (
                  <TouchableOpacity onPress={onEditTagline}
                                    style={styles.editButton}>
                    <Edit2 size={14} color="#4C585B"/>
                  </TouchableOpacity>
              )}
            </View>

            <View style={styles.statsContainer}>
              {/*Followers*/}
              <TouchableOpacity style={styles.statItem}
                                onPress={handleShowFollowers}>
                <Text style={styles.statValue}>{user?.followers.length}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>

              <View style={styles.statDivider}/>

              {/*Following*/}
              <TouchableOpacity style={styles.statItem}
                                onPress={handleShowFollowing}>
                <Text style={styles.statValue}>{user?.following.length}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>

              <View style={styles.statDivider}/>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.posts?.length || 0}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>
          </View>
        </View>

        <Divider style={styles.divider}/>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About</Text>
            {isOwnProfile && onEditAbout && (
                <TouchableOpacity onPress={onEditAbout}
                                  style={styles.editButton}>
                  <Edit2 size={16} color="#4C585B"/>
                </TouchableOpacity>
            )}
          </View>
          {user?.about ? (
              <Text style={styles.aboutText}>{user.about}</Text>
          ) : (
              <Text style={styles.emptyText}>
                {isOwnProfile ? 'Add information about yourself' : 'No information available'}
              </Text>
          )}
        </View>

        <Divider style={styles.divider}/>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            {isOwnProfile && onEditInterests && (
                <TouchableOpacity onPress={onEditInterests}
                                  style={styles.editButton}>
                  <Edit2 size={16} color="#4C585B"/>
                </TouchableOpacity>
            )}
          </View>
          {user?.interests && user.interests.length > 0 ? (
              <View style={styles.tagsContainer}>
                {user.interests.map((interest) => (
                    <View key={interest} style={styles.tag}>
                      <Text style={styles.tagText}>{interest}</Text>
                    </View>
                ))}
              </View>
          ) : (
              <Text style={styles.emptyText}>
                {isOwnProfile ? 'Add your interests' : 'No interests listed'}
              </Text>
          )}
        </View>

        <Divider style={styles.divider}/>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professions</Text>
            {isOwnProfile && onEditProfessions && (
                <TouchableOpacity onPress={onEditProfessions}
                                  style={styles.editButton}>
                  <Edit2 size={16} color="#4C585B"/>
                </TouchableOpacity>
            )}
          </View>
          {user?.professions && user.professions.length > 0 ? (
              <View style={styles.tagsContainer}>
                {user.professions.map((profession) => (
                    <View key={profession} style={styles.tag}>
                      <Text style={styles.tagText}>{profession}</Text>
                    </View>
                ))}
              </View>
          ) : (
              <Text style={styles.emptyText}>
                {isOwnProfile ? 'Add your professions' : 'No professions listed'}
              </Text>
          )}
        </View>

        <Divider style={styles.divider}/>

        <View style={styles.postsHeaderContainer}>
          <Text style={styles.sectionTitle}>Posts</Text>
        </View>
      </>
  );

  // Posts List Render
  const renderPostItem = ({item}: { item: IPost }) => (
      <View className={' !bg-background-light'}>
        <SinglePost post={item} showConnect={!isOwnProfile}/>
      </View>
  );

  return (
      <FlatList
          data={userPosts || []}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderProfileInfo}
          ListEmptyComponent={
            isLoading ? (
                <View style={styles.loadingPosts}>
                  <Progress.Circle size={40} indeterminate={true}
                                   color="#4C585B"/>
                </View>
            ) : (
                <View style={styles.emptyPosts}>
                  <Text style={styles.emptyPostsText}>No posts yet</Text>
                </View>
            )
          }
          onRefresh={onRefresh}
          refreshing={isLoading}
          onEndReached={fetchNewPosts}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
      />
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#5C7AEA',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5C7AEA',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343A40',
    marginBottom: 4,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  emptyTagline: {
    fontSize: 14,
    color: '#ADB5BD',
    fontStyle: 'italic',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E9ECEF',
  },
  divider: {
    height: 8,
    backgroundColor: '#E9ECEF',
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  postsHeaderContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343A40',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#495057',
  },
  emptyText: {
    fontSize: 14,
    color: '#ADB5BD',
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#5C7AEA',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingPosts: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  emptyPosts: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  emptyPostsText: {
    color: '#ADB5BD',
    fontSize: 16,
  },
});

export default ProfileComponent;