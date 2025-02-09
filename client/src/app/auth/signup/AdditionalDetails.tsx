import React, {useCallback, useState} from 'react';
import {FlatList, Image, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Button, Chip, Searchbar, TextInput} from 'react-native-paper';
import {Camera, Plus} from 'lucide-react-native';
import INTERESTS from '@/utils/userUtils/interested';
import PROFESSIONS from '@/utils/userUtils/professions';

interface SelectPickerProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  items: string[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  selectedItems: string[];
  onItemSelect: (item: string) => void;
}

const SelectPicker: React.FC<SelectPickerProps> = ({
                                                     visible,
                                                     onDismiss,
                                                     title,
                                                     items,
                                                     searchValue,
                                                     onSearchChange,
                                                     selectedItems,
                                                     onItemSelect
                                                   }) => {
  const filteredItems = items.filter((item: string) =>
      item.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderItem = ({item}: { item: string }) => (
      <TouchableOpacity
          onPress={() => onItemSelect(item)}
          className="mb-2"
      >
        <Chip
            selected={selectedItems.includes(item)}
            style={{
              backgroundColor: selectedItems.includes(item) ? '#4C585B' : '#A5BFCC',
            }}
            textStyle={{
              color: selectedItems.includes(item) ? '#F4EDD3' : '#2C3639',
              fontFamily: 'Poppins-Medium',
            }}
        >
          {item}
        </Chip>
      </TouchableOpacity>
  );

  return (
      <Modal
          visible={visible}
          onRequestClose={onDismiss}
          animationType="slide"
          transparent
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 max-h-[80%]">
            <Text className="font-pbold text-xl text-primary mb-4">{title}</Text>

            <View className="mb-4">
              <Searchbar
                  placeholder={`Search ${title.toLowerCase()}`}
                  onChangeText={onSearchChange}
                  value={searchValue}
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={{
                    backgroundColor: 'white',
                    elevation: 0,
                    borderWidth: 1,
                    borderColor: '#A5BFCC'
                  }}
              />
            </View>

            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={item => item}
                className="mb-4"
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  paddingHorizontal: 4
                }}
            />

            <Button
                mode="contained"
                onPress={onDismiss}
                style={{backgroundColor: '#4C585B'}}
                labelStyle={{fontFamily: 'Poppins-SemiBold'}}
            >
              Done
            </Button>
          </View>
        </View>
      </Modal>
  );
};

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
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-8">
            <View className="space-y-6">
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
                  activeOutlineColor="#4C585B"
              />

              {/* About Input */}
              <View>
                <Text className="font-pmedium text-primary mb-2">About Yourself</Text>
                <TextInput
                    value={about}
                    onChangeText={setAbout}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={{backgroundColor: '#F4EDD3'}}
                    outlineColor="#A5BFCC"
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
              <Button
                  mode="contained"
                  onPress={handleProfileComplete}
                  contentStyle={{paddingVertical: 8}}
                  style={{
                    backgroundColor: '#4C585B',
                    borderRadius: 8,
                    marginTop: 24
                  }}
                  labelStyle={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: '#F4EDD3'
                  }}
              >
                Complete Profile
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}