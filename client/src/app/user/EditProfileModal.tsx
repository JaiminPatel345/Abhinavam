import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Camera, Plus, X } from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/types/redux.types';
import { setIsImageUploading } from '@redux/slice/userSlice';
import {ICompleteProfilePayload, IUser} from '@/types/user.types';
import { MyButton } from '@components/ui/Button';
import SelectPicker from '@/app/auth/signup/SelectPicker';
import INTERESTS from '@/utils/userUtils/interested';
import PROFESSIONS from '@/utils/userUtils/professions';
import {MaterialCommunityIcons} from "@expo/vector-icons";

const EditProfileModal = ({ visible, onClose, user }:{visible:any , onClose:any , user:IUser | null}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const isImageUploading = useSelector((state: RootState) => state.user.isImageUploading);

  const [photo, setPhoto] = useState(user?.avatar?.url || '');
  const [tagline, setTagline] = useState(user?.tagline || '');
  const [about, setAbout] = useState(user?.about || '');
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showProfessionsModal, setShowProfessionsModal] = useState(false);
  const [searchInterest, setSearchInterest] = useState('');
  const [searchProfession, setSearchProfession] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(user?.professions || []);

  useEffect(() => {
    if (visible) {
      // Reset form state when modal opens
      setPhoto(user?.avatar?.url || '');
      setTagline(user?.tagline || '');
      setAbout(user?.about || '');
      setSelectedInterests(user?.interests || []);
      setSelectedProfessions(user?.professions || []);
    }
  }, [visible, user]);

  const handlePhotoUpload = async () => {
    try {
      console.log("Opening image picker");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        dispatch(setIsImageUploading(true));
        setPhoto(result.assets[0].uri);
        console.log("Would upload photo here");
        // In real implementation: await uploadUserAvatar(result);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      dispatch(setIsImageUploading(false));
    }
  };

  const handleInterestSelect = useCallback((interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  }, []);

  const handleProfessionSelect = useCallback((profession: string) => {
    setSelectedProfessions(prev =>
      prev.includes(profession)
        ? prev.filter(p => p !== profession)
        : [...prev, profession]
    );
  }, []);

  const handleSubmit = () => {
    console.log("Would submit profile updates with:");
    console.log({
      tagline,
      about,
      interests: selectedInterests,
      professions: selectedProfessions
    });

    let payload: ICompleteProfilePayload = {}
    if (user?.avatar) {
      payload.avatar = user?.avatar
    }
    if (tagline?.length > 0) {
      payload.tagline = tagline
    }
    if (about?.length > 0) {
      payload.about = about
    }
    if (selectedInterests.length > 0) {
      payload.interests = selectedInterests
    }
    if (selectedProfessions.length > 0) {
      payload.professions = selectedProfessions
    }

    // In real implementation: updateUserProfile(payload)
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <View className="bg-white rounded-t-3xl max-h-5/6">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">Edit Profile</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#4C585B" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            <View className="space-y-6">
              {/* Photo Upload */}
              <View className="items-center">
                <TouchableOpacity
                  onPress={handlePhotoUpload}
                  className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden"
                >
                  <View className="w-full h-full relative">
                    {photo && (
                      <Image
                        source={{uri: photo}}
                        className="absolute w-full h-full"
                        resizeMode="cover"
                      />
                    )}

                    {!photo && (
                      <View className="items-center justify-center h-full">
                        <Camera size={40} color="#4C585B"/>
                        <Text className="font-medium text-sm text-gray-700 mt-2">
                          Add Photo
                        </Text>
                      </View>
                    )}

                    {isImageUploading && (
                      <View className="absolute w-full h-full items-center justify-center bg-black/30">
                        <Progress.Circle
                          size={50}
                          indeterminate={true}
                          color="#ffffff"
                          borderWidth={2}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {/* Headline Input */}
              <TextInput
                label="Tag Line"
                value={tagline}
                onChangeText={setTagline}
                mode="outlined"
                style={{backgroundColor: '#F4EDD3'}}
                outlineColor="#A5BFCC"
                placeholderTextColor={'#6f8289'}
                activeOutlineColor="#4C585B"
              />

              {/* About Input */}
              <View>
                <Text className="font-medium text-gray-700 mb-2">About Yourself</Text>
                <TextInput
                  value={about}
                  onChangeText={setAbout}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={{backgroundColor: '#F4EDD3'}}
                  outlineColor="#A5BFCC"
                  placeholder={'I am a flute master...'}
                  placeholderTextColor={'#6f8289'}
                  activeOutlineColor="#4C585B"
                />
              </View>

              {/* Interests Selection */}
              <View>
                <Text className="font-medium text-gray-700 mb-2">Interests</Text>
                <TouchableOpacity
                  onPress={() => setShowInterestsModal(true)}
                  className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white"
                >
                  <Plus size={20} color="#4C585B"/>
                  <Text className="ml-2 font-medium text-gray-600">
                    {selectedInterests.length
                      ? `${selectedInterests.length} selected`
                      : 'Select your interests'}
                  </Text>
                </TouchableOpacity>

                {selectedInterests.length > 0 && (
                  <View className="flex-row flex-wrap mt-2">
                    {selectedInterests.map((interest, index) => (
                      <View key={index} className="bg-gray-100 rounded-md mr-2 mb-2 overflow-hidden">
                        <Text className="px-3 py-1 text-gray-700">{interest}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Professions Selection */}
              <View>
                <Text className="font-medium text-gray-700 mb-2">Profession</Text>
                <TouchableOpacity
                  onPress={() => setShowProfessionsModal(true)}
                  className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white"
                >
                  <Plus size={20} color="#4C585B"/>
                  <Text className="ml-2 font-medium text-gray-600">
                    {selectedProfessions.length
                      ? `${selectedProfessions.length} selected`
                      : 'Select your profession'}
                  </Text>
                </TouchableOpacity>

                {selectedProfessions.length > 0 && (
                  <View className="flex-row flex-wrap mt-2">
                    {selectedProfessions.map((profession, index) => (
                      <View key={index} className="flex-row items-center bg-gray-100 rounded-md mr-2 mb-2 overflow-hidden">
                        <View className="bg-blue-100 p-2">
                          <MaterialCommunityIcons name="briefcase-outline" size={16} color="#0077B5" />
                        </View>
                        <Text className="px-3 py-1 text-gray-700">{profession}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Selection Pickers */}
              <SelectPicker
                visible={showInterestsModal}
                onDismiss={() => {
                  setShowInterestsModal(false);
                  setSearchInterest('');
                }}
                title="Interests"
                items={INTERESTS}
                searchValue={searchInterest}
                onSearchChange={setSearchInterest}
                selectedItems={selectedInterests}
                onItemSelect={handleInterestSelect}
              />

              <SelectPicker
                visible={showProfessionsModal}
                onDismiss={() => {
                  setShowProfessionsModal(false);
                  setSearchProfession('');
                }}
                title="Professions"
                items={PROFESSIONS}
                searchValue={searchProfession}
                onSearchChange={setSearchProfession}
                selectedItems={selectedProfessions}
                onItemSelect={handleProfessionSelect}
              />

              {/* Complete Button */}
              <MyButton
                title={'Save Changes'}
                isLoading={isLoading}
                onPressAction={handleSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;