import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native';
import {
  Button,
  Card,
  Chip,
  Dialog,
  IconButton,
  Portal,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';
import {MyButton} from "@/components/ui/Button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import usePost from "@/hooks/usePost";
import * as ImagePicker from "expo-image-picker";
import {ICreatePostForm, ILocation, IMediaItem} from "@/types/posts.types";
import {setCurrentRoute} from "@/redux/slice/navigationSlice";
import {useIsFocused} from "@react-navigation/core";


const CreatePost: React.FC = () => {
  const theme = useTheme();
  const {height} = useWindowDimensions();

  const [form, setForm] = useState<ICreatePostForm>({
    description: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState<string>('');
  const [showLocationDialog, setShowLocationDialog] = useState<boolean>(false);
  const [location, setLocation] = useState<ILocation>({
    city: '',
    country: ''
  });
  // Add state for selected images
  const [selectedImages, setSelectedImages] = useState<Array<string>>([]);

  const {createPost} = usePost();
  const isLoading: boolean = useSelector((state: RootState) => state.posts.isLoading);
  const dispatch = useDispatch()
  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(setCurrentRoute('/post/create'))
  }, []);


  useEffect(() => {
    if (isFocused) {
      dispatch(setCurrentRoute('/'))
    }

  }, [isFocused]);

  // Placeholder functions for API calls
  const handleSubmitPost = async () => {
    try {
      console.log('Submitting post:', form);
      createPost(form, selectedImages);

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddMedia = async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.log('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos', 'livePhotos'],
        allowsEditing: false,
        quality: 1,
        // allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Media added:');
        // Store the image URI in the local state for display
        setSelectedImages(prevImages => [...prevImages, result.assets[0].uri]);

        // Fix TypeScript error by properly handling the media array
        const newMediaItem: IMediaItem = {
          url: result.assets[0].uri,
          public_id: `temp_${Date.now()}` // Temporary ID until actual upload
        };

      }

    } catch (error) {
      console.error('Error adding media:', error);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove from selectedImages
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));


  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().replaceAll(' ', '_')]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleLocationSubmit = () => {
    setForm(prev => ({
      ...prev,
      location
    }));
    setShowLocationDialog(false);
  };

  return (
      <ScrollView style={[styles.container]} className={'bg-background'}>
        <View style={[styles.contentContainer, {minHeight: height * 0.8}]}>

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* Description Input */}
            <Card style={styles.descriptionCard}
                  className={'bg-background-light'}>
              <Card.Content>
                <TextInput
                    mode="flat"
                    placeholder="What's on your mind?"
                    multiline
                    numberOfLines={8}
                    value={form.description}
                    onChangeText={(text) => setForm(prev => ({
                      ...prev,
                      description: text
                    }))}
                    style={[styles.descriptionInput, {minHeight: height * 0.2}]}
                />

                {/* Display Selected Images */}
                {selectedImages.length > 0 && (
                    <View style={styles.selectedImagesContainer}>
                      {selectedImages.map((uri, index) => (
                          <View key={index} style={styles.imageWrapper}>
                            <Image source={{uri}} style={styles.selectedImage}/>
                            <IconButton
                                icon="close"
                                size={20}
                                style={styles.removeImageButton}
                                iconColor="white"
                                onPress={() => handleRemoveImage(index)}
                            />
                          </View>
                      ))}
                    </View>
                )}

                {/* Media Attachment Section */}
                <View style={styles.mediaSection}>
                  <Text variant="titleMedium" style={styles.mediaSectionTitle}>
                    Add to your post
                  </Text>
                  <View style={styles.mediaButtons}>
                    <View style={styles.addImageContainer}>

                      <IconButton
                          icon="image"
                          mode="contained"
                          size={24}
                          onPress={handleAddMedia}
                          containerColor={theme.colors.primary}
                          iconColor="white"
                      />
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Tags Section */}
            <Card style={styles.tagsCard}>
              <Card.Content>
                <TextInput
                    mode="outlined"
                    label="Add tags"
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={handleAddTag}
                    right={<TextInput.Icon icon="plus" onPress={handleAddTag}/>}
                    style={styles.tagInput}
                />
                <View style={styles.chipContainer}>
                  {form.tags.map((tag) => (
                      <Chip
                          key={tag}
                          onClose={() => handleRemoveTag(tag)}
                          style={styles.chip}
                      >
                        {`#${tag}`}
                      </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>

            {/* Location Section */}
            <Card style={styles.locationCard}>
              <Card.Content>
                <Button
                    mode="outlined"
                    icon="map-marker"
                    onPress={() => setShowLocationDialog(true)}
                >
                  {form.location ?
                      `${form.location.city}, ${form.location.country}` :
                      'Add Location'
                  }
                </Button>
              </Card.Content>
            </Card>
          </View>

          <MyButton title={'Post'}
                    disabled={!form.description.trim() && selectedImages?.length === 0}
                    onPressAction={handleSubmitPost}
                    isLoading={isLoading}
          />
        </View>

        {/* Location Dialog */}
        <Portal>
          <Dialog visible={showLocationDialog}
                  onDismiss={() => setShowLocationDialog(false)}>
            <Dialog.Title>Add Location</Dialog.Title>
            <Dialog.Content>
              <TextInput
                  mode="outlined"
                  label="City"
                  defaultValue={location.city}
                  onChangeText={(text) => setLocation(prev => ({
                    ...prev,
                    city: text
                  }))}
                  style={styles.dialogInput}
              />
              <TextInput
                  mode="outlined"
                  label="Country"
                  defaultValue={location.country}
                  onChangeText={(text) => setLocation(prev => ({
                    ...prev,
                    country: text
                  }))}
                  style={styles.dialogInput}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                  onPress={() => setShowLocationDialog(false)}>Cancel</Button>
              <Button onPress={handleLocationSubmit}>Add</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  mainContent: {

    padding: 16,
  },
  descriptionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  descriptionInput: {
    fontSize: 14,
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 0,
  },
  mediaSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  mediaSectionTitle: {
    marginBottom: 8,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  addImageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  imageIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  plusIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    margin: 0,
  },
  tagsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  tagInput: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  locationCard: {
    marginBottom: 2,
    elevation: 2,
  },
  dialogInput: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  submitButton: {
    margin: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});

export default CreatePost;