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
import {clearAllPosts, updateToNextPage} from "@/redux/slice/postSlice";
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
import {setIsImageUploading} from "@/redux/slice/userSlice";
import {showNotification} from "@/redux/slice/notificationSlice";
import SelectPicker from '@/app/auth/signup/SelectPicker';
import INTERESTS from '@/utils/userUtils/interested';
import PROFESSIONS from '@/utils/userUtils/professions';
import {IPost} from "@/types/posts.types";
import {ICompleteProfilePayload} from "@/types/user.types";
import ProfileComponent from '@/components/ui/ProfileComponent';
import {setCurrentRoute} from "@/redux/slice/navigationSlice";

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
  const dispatch = useDispatch();

  // Selectors
  const user = useSelector((state: RootState) => state.user.user);
  const allPosts = useSelector((state: RootState) => state.posts.posts);
  const isLoading = useSelector((state: RootState) => state.posts.isLoading);
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
      console.log("user is logged in")
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
  const handleRefresh = () => {
    dispatch(clearAllPosts());
    setPage(1);
    if (user) {
      fetchPosts({username: user.username, page: 1, limit});
    }
  };

  const fetchNewPosts = () => {
    if (user) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(updateToNextPage());
      fetchPosts({username: user.username, page: nextPage, limit});
    }
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
          >
            <View style={styles.modalContent}>
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
            </View>
          </Modal>
        </Portal>

        {/* Full Image Modal */}
        <Portal>
          <Modal
              visible={fullImageVisible}
              onDismiss={() => setFullImageVisible(false)}
          >
            <TouchableOpacity
                style={styles.closeFullImage}
                onPress={() => setFullImageVisible(false)}
            >
              <X size={35} color="#FFFFFF"/>
            </TouchableOpacity>
            <Image
                source={{uri: user?.avatar?.url || 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png'}}
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
          >
            <View style={styles.modalContent}>
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
            </View>
          </Modal>
        </Portal>

        {/* Edit About Modal */}
        <Portal>
          <Modal
              visible={editAboutVisible}
              onDismiss={() => setEditAboutVisible(false)}
          >
            <View style={styles.modalContent}>
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
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343A40',
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
    backgroundColor: '#5C7AEA',
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