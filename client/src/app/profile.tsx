import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import {router} from "expo-router";
import {Divider, Menu, Modal, Portal, TextInput} from "react-native-paper";
import {updateToNextPage} from "@/redux/slice/postSlice";
import usePost from "@/hooks/usePost";
import {
  Edit2,
  Eye,
  Image as ImageIcon,
  LogOut,
  MoreVertical,
  X
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import {clearUserFollowers, setIsImageUploading} from "@/redux/slice/userSlice";
import {showNotification} from "@/redux/slice/notificationSlice";
import SelectPicker from '@/app/auth/signup/SelectPicker';
import INTERESTS from '@/utils/userUtils/interested';
import PROFESSIONS from '@/utils/userUtils/professions';
import {IPost} from "@/types/posts.types";
import {ICompleteProfilePayload} from "@/types/user.types";
import ProfileComponent from '@/components/ui/ProfileComponent';
import {setCurrentRoute} from "@/redux/slice/navigationSlice";
import {StatusBar} from 'expo-status-bar';
import {fetchMyData} from "@/redux/thunks/userThunk";

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
  const dispatch = useDispatch<any>();

  // Selectors
  const user = useSelector((state: RootState) => state.user.user);
  const allPosts = useSelector((state: RootState) => state.posts.posts);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const isImageUploading = useSelector((state: RootState) => state.user.isImageUploading);

  useEffect(() => {
    if (!user) {
      dispatch(setCurrentRoute('/auth/login'))
      dispatch(showNotification({
        message: 'Please login to view your profile',
        type: 'WARNING',
        title: 'Not logged in'
      }))
      router.replace("/auth/login");
    }
  }, []);

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
      fetchPosts({username: user.username, page, limit});
    }
  }, [user, page]);

  // Update userPosts when allPosts changes
  useEffect(() => {
    if (user && allPosts && Object.keys(allPosts).length > 0) {
      const filteredPosts = user.posts
          .map((postId: string) => allPosts[postId])
          .filter((post: IPost) => post !== undefined);
      setUserPosts(filteredPosts);
    }
  }, [allPosts, user]);

  // Handlers
  const handleRefresh = useCallback(() => {
    dispatch(fetchMyData())
    dispatch(clearUserFollowers());
    setPage(1);
    if (user) {
      return fetchPosts({username: user.username, page: 1, limit});
    }
  }, [user, fetchPosts, dispatch, limit]);

  const fetchNewPosts = useCallback(() => {
    if (user) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(updateToNextPage());
      fetchPosts({username: user.username, page: nextPage, limit});
    }
  }, [user, page, fetchPosts, dispatch, limit]);

  const handleLogout = () => {
    logoutUser();
    setMenuVisible(false);
    router.replace('/auth/login')
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

  // Loading state
  if (!user) {
    return (
        <View
            className="flex-1 justify-center items-center bg-background-light">
          <Progress.Circle size={50} indeterminate={true} color="#0095F6"/>
        </View>
    );
  }

  return (
      <>
        <StatusBar style="dark"/>
        <SafeAreaView className="flex-1 bg-background-light">
          {/* Header */}
          <View
              className="w-full flex-row  items-center px-4 py-3 border-b border-instagram-separator">
            <Text
                className="text-lg font-semibold text-secondary">{user?.name || 'Profile'}</Text>
            <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                className="p-1 absolute right-4"
            >
              <MoreVertical size={24} color="#262626"/>
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
                  leadingIcon={() => <Edit2 size={20} color="#0095F6"/>}
                  titleStyle={{fontFamily: 'Poppins-Medium'}}
              />
              <Divider/>
              <Menu.Item
                  onPress={handleLogout}
                  title="Logout"
                  leadingIcon={() => <LogOut size={20} color="#ED4956"/>}
                  titleStyle={{color: '#ED4956', fontFamily: 'Poppins-Medium'}}
              />
            </Menu>
          </View>

          {/* Main profile content */}
          <ProfileComponent
              user={user}
              userPosts={userPosts}
              isLoading={isLoading}
              isImageUploading={isImageUploading}
              isOwnProfile={true}
              onRefresh={handleRefresh}
              fetchNewPosts={fetchNewPosts}
              onEditAvatar={() => setImageOptionsVisible(true)}
              onViewAvatar={() => {
                setImageOptionsVisible(false);
                setFullImageVisible(true);
              }}
              onEditTagline={() => setEditTaglineVisible(true)}
              onEditAbout={() => setEditAboutVisible(true)}
              onEditInterests={() => setEditingInterests(true)}
              onEditProfessions={() => setEditingProfessions(true)}
          />

          {/* Image Options Modal */}
          <Portal>
            <Modal
                visible={imageOptionsVisible}
                onDismiss={() => setImageOptionsVisible(false)}
                contentContainerStyle={styles.instagramModal}
            >
              <View>
                <View
                    className="flex-row justify-between items-center p-4 border-b border-instagram-separator">
                  <Text className="text-base font-semibold text-secondary">Profile
                    Photo</Text>
                  <TouchableOpacity
                      onPress={() => setImageOptionsVisible(false)}>
                    <X size={24} color="#262626"/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                    className="flex-row items-center p-4 border-b border-instagram-separator"
                    onPress={handlePhotoUpload}
                >
                  <ImageIcon size={20} color="#0095F6"/>
                  <Text className="ml-3 text-sm text-secondary font-medium">Change
                    photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center p-4"
                    onPress={() => {
                      setImageOptionsVisible(false);
                      setFullImageVisible(true);
                    }}
                >
                  <Eye size={20} color="#0095F6"/>
                  <Text className="ml-3 text-sm text-secondary font-medium">View
                    photo</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </Portal>

          {/* Full Image Modal */}
          <Portal>
            <Modal
                visible={fullImageVisible}
                onDismiss={() => setFullImageVisible(false)}
                contentContainerStyle={styles.fullScreenModal}
            >
              <TouchableOpacity
                  className="absolute top-10 right-6 z-10 bg-black bg-opacity-50 rounded-full p-2"
                  onPress={() => setFullImageVisible(false)}
              >
                <X size={28} color="#FFFFFF"/>
              </TouchableOpacity>
              <Image
                  source={{uri: user?.avatar?.url || 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png'}}
                  className="w-full h-full"
                  resizeMode="contain"
              />
            </Modal>
          </Portal>

          {/* Edit Tagline Modal */}
          <Portal>
            <Modal
                visible={editTaglineVisible}
                onDismiss={() => setEditTaglineVisible(false)}
                contentContainerStyle={styles.instagramModal}
            >
              <View>
                <View
                    className="flex-row justify-between items-center p-4 border-b border-instagram-separator">
                  <Text className="text-base font-semibold text-secondary">Edit
                    Tagline</Text>
                  <TouchableOpacity
                      onPress={() => setEditTaglineVisible(false)}>
                    <X size={24} color="#262626"/>
                  </TouchableOpacity>
                </View>
                <View className="p-4">
                  <TextInput
                      label="Tagline"
                      value={tagline}
                      onChangeText={setTagline}
                      mode="outlined"
                      className="mb-4"
                      outlineColor="#DBDBDB"
                      placeholderTextColor="#8E8E8E"
                      activeOutlineColor="#0095F6"
                      style={{fontFamily: 'Poppins-Regular'}}
                  />
                  <TouchableOpacity
                      className="bg-primary rounded-lg py-3 items-center"
                      onPress={saveTagline}
                  >
                    <Text
                        className="font-semibold text-white text-sm">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </Portal>

          {/* Edit About Modal */}
          <Portal>
            <Modal
                visible={editAboutVisible}
                onDismiss={() => setEditAboutVisible(false)}
                contentContainerStyle={styles.instagramModal}
            >
              <View>
                <View
                    className="flex-row justify-between items-center p-4 border-b border-instagram-separator">
                  <Text className="text-base font-semibold text-secondary">Edit
                    About</Text>
                  <TouchableOpacity onPress={() => setEditAboutVisible(false)}>
                    <X size={24} color="#262626"/>
                  </TouchableOpacity>
                </View>
                <View className="p-4">
                  <TextInput
                      label="About"
                      value={about}
                      onChangeText={setAbout}
                      mode="outlined"
                      multiline
                      numberOfLines={4}
                      className="mb-4"
                      outlineColor="#DBDBDB"
                      placeholderTextColor="#8E8E8E"
                      activeOutlineColor="#0095F6"
                      style={{fontFamily: 'Poppins-Regular'}}
                  />
                  <TouchableOpacity
                      className="bg-primary rounded-lg py-3 items-center"
                      onPress={saveAbout}
                  >
                    <Text
                        className="font-semibold text-white text-sm">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </Portal>

          {/* Interests and Professions Selectors */}
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
      </>
  );
}

const styles = StyleSheet.create({
  menuContent: {
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  instagramModal: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    margin: 0,
  },
});