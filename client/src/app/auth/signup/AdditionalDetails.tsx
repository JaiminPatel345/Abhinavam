import React, {useCallback, useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Camera, Plus} from 'lucide-react-native';
import INTERESTS from '@/utils/userUtils/interested';
import PROFESSIONS from '@/utils/userUtils/professions';
import {SelectPicker} from '@/app/auth/signup/SelectPicker';
import {MyButton} from "@components/ui/Button";


export default function AdditionalDetailsScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showProfessionsModal, setShowProfessionsModal] = useState(false);
  const [searchInterest, setSearchInterest] = useState('');
  const [searchProfession, setSearchProfession] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);

  const handlePhotoUpload = () => {
    // Implement photo upload logic here
    console.log('Upload photo');
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

  const handleProfileComplete = () => {
    console.log({
      photo,
      headline,
      about,
      selectedInterests,
      selectedProfessions
    });
  };

  return (
      <SafeAreaView className="flex-1 bg-background ">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-8">
            <View className="space-y-6 flex gap-5">
              {/* Photo Upload */}
              <View className="items-center">
                <TouchableOpacity
                    onPress={handlePhotoUpload}
                    className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden"
                >
                  {photo ? (
                      <Image source={{uri: photo}} className="w-full h-full"/>
                  ) : (
                      <View className="items-center">
                        <Camera size={40} color="#4C585B"/>
                        <Text className="font-pmedium text-sm text-primary mt-2">Add Photo</Text>
                      </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Headline Input */}
              <TextInput
                  label="Headline"
                  value={headline}
                  onChangeText={setHeadline}
                  mode="outlined"
                  style={{backgroundColor: '#F4EDD3'}}
                  outlineColor="#A5BFCC"
                  placeholderTextColor={'#6f8289'}
                  activeOutlineColor="#4C585B"
              />

              {/* About Input */}
              <View>
                <Text className="font-pmedium text-primary mb-2 ">About Yourself</Text>
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
                <Text className="font-pmedium text-primary mb-2">Interests</Text>
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
                <Text className="font-pmedium text-primary mb-2">Profession</Text>
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

              <MyButton title={'Complete Profile'} onPressAction={handleProfileComplete}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}