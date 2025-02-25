import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Camera, Plus} from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import INTERESTS from '@/utils/userUtils/interested';
import PROFESSIONS from '@/utils/userUtils/professions';
import SelectPicker from '@/app/auth/signup/SelectPicker';
import {MyButton} from "@components/ui/Button";
import * as ImagePicker from 'expo-image-picker';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import {setIsImageUploading} from "@redux/slice/userSlice";
import useUser from "@/hooks/useUser";
import {ICompleteProfilePayload} from "@/types/user.types";
import {showNotification} from "@redux/slice/notificationSlice";
import {Link} from "expo-router";

export default function AdditionalDetailsScreen() {
  const user = useSelector((state: RootState) => state.user.user);
  const [photo, setPhoto] = useState<string | null>(user?.avatar?.url || '');
  const [tagline, setTagline] = useState(user?.tagline || '');
  const [about, setAbout] = useState(user?.about || '');
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showProfessionsModal, setShowProfessionsModal] = useState(false);
  const [searchInterest, setSearchInterest] = useState('');
  const [searchProfession, setSearchProfession] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(user?.professions || []);

  const isImageUploading = useSelector((state: RootState) => state.user.isImageUploading);
  const dispatch = useDispatch();
  const {uploadUserProfile, updateUserProfile} = useUser();


  const isLoading = useSelector((state: any) => state.user.isLoading);


  useEffect(() => {
    setPhoto(user?.avatar?.url || 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png')
  }, [user]);


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

        // Update local state immediately for UI feedback
        setPhoto(result.assets[0].uri);


        // Upload the image - pass the entire result
        await uploadUserProfile(result);
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
    if (Object.keys(payload).length === 0) {
      dispatch(showNotification({
        message: 'Please fill out at least one field',
        type: 'WARNING',
        title: 'Incomplete Profile'
      }))
    }

    //submit
    updateUserProfile(payload)

  }


  return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-8">
            <View className="space-y-6 flex gap-5">
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
                          <Text
                              className="font-pmedium text-sm text-primary mt-2">Add
                            Photo</Text>
                        </View>
                    )}

                    {isImageUploading && (
                        <View
                            className="absolute w-full h-full items-center justify-center bg-black/30">
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
                <Text className="font-pmedium text-primary mb-2 ">About
                  Yourself</Text>
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
                <Text
                    className="font-pmedium text-primary mb-2">Interests</Text>
                <TouchableOpacity
                    onPress={() => setShowInterestsModal(true)}
                    className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white"
                >
                  <Plus size={20} color="#4C585B"/>
                  <Text className="ml-2 font-pmedium text-gray-600">
                    {selectedInterests.length
                        ? `${selectedInterests.length} selected`
                        : 'Select your interests'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Professions Selection */}
              <View>
                <Text
                    className="font-pmedium text-primary mb-2">Profession</Text>
                <TouchableOpacity
                    onPress={() => setShowProfessionsModal(true)}
                    className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white"
                >
                  <Plus size={20} color="#4C585B"/>
                  <Text className="ml-2 font-pmedium text-gray-600">
                    {selectedProfessions.length
                        ? `${selectedProfessions.length} selected`
                        : 'Select your profession'}
                  </Text>
                </TouchableOpacity>
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

              <MyButton title={'Complete Profile'} isLoading={isLoading}
                        onPressAction={() => handleSubmit()}/>
              <View>
                <Link href={"/"}
                      className="font-pmedium text-primary text-center">
                  Skip for now
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}