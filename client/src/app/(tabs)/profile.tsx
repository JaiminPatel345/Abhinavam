import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import {useRouter} from "expo-router";
import {Divider, Menu, Portal, TextInput} from "react-native-paper";
import SinglePost from '../posts/SinglePost';
import {clearAllPosts, updateToNextPage} from "@redux/slice/postSlice";
import usePost from "@/hooks/usePost";
import {
  Camera,
  Edit2,
  Eye,
  Image as ImageIcon,
  LogOut,
  MoreVertical,
  X
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import {setIsImageUploading} from "@redux/slice/userSlice";
import {showNotification} from "@redux/slice/notificationSlice";
import SelectPicker from '@/app/auth/signup/SelectPicker';
import INTERESTS from '@/utils/userUtils/interested';
import PROFESSIONS from '@/utils/userUtils/professions';
import {IPost} from "@/types/posts.types";
import {ICompleteProfilePayload} from "@/types/user.types";

export default function ProfileScreen() {
  // State and hooks
  const [userPosts, setUserPosts] = useState<IPost[] | null>(null);
  const [page, setPage] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [editTaglineVisible, setEditTaglineVisible] = useState(false);
  const [editAboutVisible, setEditAboutVisible] = useState(false);
  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');
  const [editingInterests, setEditingInterests] = useState(false);
  const [editingProfessions, setEditingProfessions] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [searchInterest, setSearchInterest] = useState('');
  const [searchProfession, setSearchProfession] = useState('');

  const limit = 10;
  const {logoutUser} = useAuth();
  const {fetchPosts} = usePost();
  const {uploadUserAvatar, updateUserProfile} = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  // Selectors
  const user = useSelector((state: RootState) => state.user.user);
  const allPosts = useSelector((state: RootState) => state.posts.posts);
  const isLoading = useSelector((state: RootState) => state.posts.isLoading);
  const isImageUploading = useSelector((state: RootState) => state.user.isImageUploading);

  // Initialize state values from user data
  useEffect(() => {
    if (user) {
      setTagline(user.tagline || '');
      setAbout(user.about || '');
      setSelectedInterests(user.interests || []);
      setSelectedProfessions(user.professions || []);
    }
  }, [user]);

  // Fetch posts on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchPosts({userId: user._id, page, limit});
    } else {
      router.push("/auth/login");
    }
  }, [user, page]);

  // Update userPosts when allPosts changes
  useEffect(() => {
    if (user && allPosts && Object.keys(allPosts).length > 0) {
      const filteredPosts = user.posts
          .map((postId) => allPosts[postId])
          .filter(post => post !== undefined);
      setUserPosts(filteredPosts);
    }
  }, [allPosts, user]);

  // Handlers
  const handleRefresh = () => {
    dispatch(clearAllPosts());
    setPage(1);
    fetchPosts({userId: user?._id, page: 1, limit});
  };

  const fetchNewPosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(updateToNextPage());
    fetchPosts({userId: user?._id, page: nextPage, limit});
  };

  const handleLogout = () => {
    logoutUser();
    setMenuVisible(false);
  };

  const handlePhotoUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        dispatch(setIsImageUploading(true));
        setImageOptionsVisible(false);
        await uploadUserAvatar(result);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      dispatch(showNotification({
        message: 'Failed to upload photo',
        type: 'ERROR',
        title: 'Error'
      }));
    } finally {
      dispatch(setIsImageUploading(false));
      setImageOptionsVisible(false);
    }
  };

  const updateProfile = (payload: ICompleteProfilePayload) => {
    updateUserProfile(payload);
  };

  const handleInterestSelect = useCallback((interest: string) => {
    setSelectedInterests((prev: string[]) =>
        prev.includes(interest)
            ? prev.filter(i => i !== interest)
            : [...prev, interest]
    );
  }, []);

  const handleProfessionSelect = useCallback((profession: string) => {
    setSelectedProfessions((prev: string[]) =>
        prev.includes(profession)
            ? prev.filter(p => p !== profession)
            : [...prev, profession]
    );
  }, []);

  const saveInterests = () => {
    updateProfile({interests: selectedInterests});
    setEditingInterests(false);
  };

  const saveProfessions = () => {
    updateProfile({professions: selectedProfessions});
    setEditingProfessions(false);
  };

  const saveTagline = () => {
    updateProfile({tagline});
    setEditTaglineVisible(false);
  };

  const saveAbout = () => {
    updateProfile({about});
    setEditAboutVisible(false);
  };

  // Profile Info Section
  const renderProfileInfo = () => (
    <>
      <View style={styles.profileHeader}>
        <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => setImageOptionsVisible(true)}
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
          <View style={styles.editImageButton}>
            <Camera size={16} color="#FFFFFF"/>
          </View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.username}</Text>

          <View style={styles.taglineContainer}>
            {user?.tagline ? (
                <Text style={styles.tagline}>{user.tagline}</Text>
            ) : (
                <Text style={styles.emptyTagline}>Add a tagline</Text>
            )}
            <TouchableOpacity onPress={() => setEditTaglineVisible(true)}
                              style={styles.editButton}>
              <Edit2 size={14} color="#4C585B"/>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.followers.length}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider}/>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.following.length}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider}/>
            <View style={styles.statItem}>
              <Text
                  style={styles.statValue}>{user?.posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>
      </View>

      <Divider style={styles.divider}/>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity onPress={() => setEditAboutVisible(true)}
                            style={styles.editButton}>
            <Edit2 size={16} color="#4C585B"/>
          </TouchableOpacity>
        </View>
        {user?.about ? (
            <Text style={styles.aboutText}>{user.about}</Text>
        ) : (
            <Text style={styles.emptyText}>Add information about
              yourself</Text>
        )}
      </View>

      <Divider style={styles.divider}/>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <TouchableOpacity onPress={() => setEditingInterests(true)}
                            style={styles.editButton}>
            <Edit2 size={16} color="#4C585B"/>
          </TouchableOpacity>
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
            <Text style={styles.emptyText}>Add your interests</Text>
        )}
      </View>

      <Divider style={styles.divider}/>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Professions</Text>
          <TouchableOpacity onPress={() => setEditingProfessions(true)}
                            style={styles.editButton}>
            <Edit2 size={16} color="#4C585B"/>
          </TouchableOpacity>
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
            <Text style={styles.emptyText}>Add your professions</Text>
        )}
      </View>

      <Divider style={styles.divider}/>

      <View style={styles.postsHeaderContainer}>
        <Text style={styles.sectionTitle}>Posts</Text>
      </View>
    </>
  );

  // Posts List Render
  const renderPostItem = ({item}: {item: IPost}) => (
    <SinglePost post={item} showConnect={false} />
  );

  // Loading state
  if (!user) {
    return (
        <View style={styles.loadingContainer}>
          <Progress.Circle size={50} indeterminate={true} color="#4C585B"/>
        </View>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}
                            style={styles.menuButton}>
            <MoreVertical size={24} color="#000000"/>
          </TouchableOpacity>

          <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={{x: 370, y: 55}}
              contentStyle={styles.menuContent}
          >
            <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  router.push("/auth/signup/AdditionalDetails");
                }}
                title="Edit Profile"
                leadingIcon={() => <Edit2 size={20} color="#4C585B"/>}
            />
            <Divider/>
            <Menu.Item
                onPress={handleLogout}
                title="Logout"
                leadingIcon={() => <LogOut size={20} color="#E53935"/>}
                titleStyle={{color: '#E53935'}}
            />
          </Menu>
        </View>

        {/* Main content using FlatList for posts instead of ScrollView */}
        <FlatList
          data={userPosts || []}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderProfileInfo}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingPosts}>
                <Progress.Circle size={40} indeterminate={true} color="#4C585B"/>
              </View>
            ) : (
              <View style={styles.emptyPosts}>
                <Text style={styles.emptyPostsText}>No posts yet</Text>
              </View>
            )
          }
          onRefresh={handleRefresh}
          refreshing={isLoading}
          onEndReached={fetchNewPosts}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />

        {/* Image Options Modal */}
        <Portal>
          <Modal
              visible={imageOptionsVisible}
              onDismiss={() => setImageOptionsVisible(false)}
              contentContainerStyle={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Photo</Text>
              <TouchableOpacity onPress={() => setImageOptionsVisible(false)}>
                <X size={24} color="#4C585B"/>
              </TouchableOpacity>
            </View>
            <Divider/>
            <TouchableOpacity
                style={styles.modalOption}
                onPress={handlePhotoUpload}
            >
              <ImageIcon size={20} color="#4C585B"/>
              <Text style={styles.modalOptionText}>Change photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setImageOptionsVisible(false);
                  setFullImageVisible(true);
                }}
            >
              <Eye size={20} color="#4C585B"/>
              <Text style={styles.modalOptionText}>View photo</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>

        {/* Full Image Modal */}
        <Portal>
          <Modal
              visible={fullImageVisible}
              onDismiss={() => setFullImageVisible(false)}
              contentContainerStyle={styles.fullImageContainer}
          >
            <TouchableOpacity
                style={styles.closeFullImage}
                onPress={() => setFullImageVisible(false)}
            >
              <X size={35} color="#FFFFFF"/>
            </TouchableOpacity>
            <Image
                source={{uri: user.avatar?.url || 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png'}}
                style={styles.fullImage}
                resizeMode="contain"
            />
          </Modal>
        </Portal>

        {/* Edit Tagline Modal */}
        <Portal>
          <Modal
              visible={editTaglineVisible}
              onDismiss={() => setEditTaglineVisible(false)}
              contentContainerStyle={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Tagline</Text>
              <TouchableOpacity onPress={() => setEditTaglineVisible(false)}>
                <X size={24} color="#4C585B"/>
              </TouchableOpacity>
            </View>
            <Divider/>
            <View style={styles.modalBody}>
              <TextInput
                  label="Tagline"
                  defaultValue={tagline}
                  onChangeText={setTagline}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#A5BFCC"
                  placeholderTextColor={'#6f8289'}
                  activeOutlineColor="#4C585B"
              />
              <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveTagline}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>

        {/* Edit About Modal */}
        <Portal>
          <Modal
              visible={editAboutVisible}
              onDismiss={() => setEditAboutVisible(false)}
              contentContainerStyle={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit About</Text>
              <TouchableOpacity onPress={() => setEditAboutVisible(false)}>
                <X size={24} color="#4C585B"/>
              </TouchableOpacity>
            </View>
            <Divider/>
            <View style={styles.modalBody}>
              <TextInput
                  label="About"
                  defaultValue={about}
                  onChangeText={setAbout}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                  outlineColor="#A5BFCC"
                  placeholderTextColor={'#6f8289'}
                  activeOutlineColor="#4C585B"
              />
              <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveAbout}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>

        {/* Interests Selection */}
        <SelectPicker
            visible={editingInterests}
            onDismiss={() => {
              setEditingInterests(false);
              setSearchInterest('');
            }}
            title="Interests"
            items={INTERESTS}
            searchValue={searchInterest}
            onSearchChange={setSearchInterest}
            selectedItems={selectedInterests}
            onItemSelect={handleInterestSelect}
            onSave={saveInterests}
        />

        {/* Professions Selection */}
        <SelectPicker
            visible={editingProfessions}
            onDismiss={() => {
              setEditingProfessions(false);
              setSearchProfession('');
            }}
            title="Professions"
            items={PROFESSIONS}
            searchValue={searchProfession}
            onSearchChange={setSearchProfession}
            selectedItems={selectedProfessions}
            onItemSelect={handleProfessionSelect}
            onSave={saveProfessions}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Modern light gray background (updated from #F4EDD3)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA', // Updated background color
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF', // White header
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF', // Lighter border color
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343A40', // Darker text for better contrast
  },
  menuButton: {
    position: 'absolute',
    padding: 4,
    right: 10,
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF', // White background for profile section
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
    borderColor: '#5C7AEA', // Updated accent color
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
    backgroundColor: '#5C7AEA', // Updated color
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
    color: '#343A40', // Darker color for better readability
    marginBottom: 4,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#495057', // Updated color
    flex: 1,
  },
  emptyTagline: {
    fontSize: 14,
    color: '#ADB5BD', // Lighter color for placeholder text
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
    backgroundColor: '#E9ECEF', // Lighter color for divider
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF', // White background
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
    backgroundColor: '#5C7AEA', // Updated color for tags
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
  postsContainer: {
    backgroundColor: '#FFFFFF',
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
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343A40',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  modalOptionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#495057',
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#212529'
  },
  closeFullImage: {
    position: 'absolute',
    top: 40,
    right: 40,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalBody: {
    padding: 16,
  },
  input: {
    backgroundColor: '#F8F9FA',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#5C7AEA', // Updated color for buttons
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});