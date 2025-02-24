import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
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
import {MyButton} from "@components/ui/Button";
import {useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import usePost from "@/hooks/usePost";
import {useRouter} from "expo-router";

interface Location {
  city: string;
  country: string;
}

interface CreatePostForm {
  description: string;
  location?: Location;
  tags: string[];
  mediaIds: string[];
}

const CreatePost: React.FC = () => {
  const theme = useTheme();
  const {height} = useWindowDimensions();

  const [form, setForm] = useState<CreatePostForm>({
    description: '',
    tags: [],
    mediaIds: [],
  });
  const [tagInput, setTagInput] = useState<string>('');
  const [showLocationDialog, setShowLocationDialog] = useState<boolean>(false);
  const [location, setLocation] = useState<Location>({
    city: '',
    country: ''
  });
  const router = useRouter();
  const {createPost} = usePost();
  const isLoading = useSelector((state: RootState) => state.posts.isLoading);

  const redirectUrl = useSelector((state: RootState) => state.posts.redirectUrl);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push(redirectUrl)
  }, [redirectUrl])


  // Placeholder functions for API calls
  const handleSubmitPost = async () => {
    try {
      console.log('Submitting post:', form);
      createPost(form);

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddMedia = async () => {
    try {
      console.log('Adding media');
    } catch (error) {
      console.error('Error adding media:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().replace(' ' , '_')]
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
                    style={[styles.descriptionInput, {minHeight: height * 0.3}]}
                />

                {/* Media Attachment Section */}
                <View style={styles.mediaSection}>
                  <Text variant="titleMedium" style={styles.mediaSectionTitle}>
                    Add to your post
                  </Text>
                  <View style={styles.mediaButtons}>
                    <IconButton
                        icon="image"
                        mode="contained"
                        size={24}
                        onPress={handleAddMedia}
                        containerColor={theme.colors.primary}
                        iconColor="white"
                    />
                    <IconButton
                        icon="camera"
                        mode="contained"
                        size={24}
                        onPress={handleAddMedia}
                        containerColor={theme.colors.primary}
                        iconColor="white"
                    />
                    <IconButton
                        icon="video"
                        mode="contained"
                        size={24}
                        onPress={handleAddMedia}
                        containerColor={theme.colors.primary}
                        iconColor="white"
                    />
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

          {/* Submit Button */}
          {/*<Button*/}
          {/*  mode="contained"*/}
          {/*  onPress={handleSubmitPost}*/}
          {/*  disabled={!form.description.trim() && form.mediaIds.length === 0}*/}
          {/*  style={styles.submitButton}*/}
          {/*  contentStyle={styles.submitButtonContent}*/}
          {/*>*/}
          {/*  Post*/}
          {/*</Button>*/}

          <MyButton title={'Post'}
                    disabled={!form.description.trim() && form.mediaIds.length === 0}
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
                  value={location.city}
                  onChangeText={(text) => setLocation(prev => ({
                    ...prev,
                    city: text
                  }))}
                  style={styles.dialogInput}
              />
              <TextInput
                  mode="outlined"
                  label="Country"
                  value={location.country}
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
    flex: 1,
    padding: 16,
  },
  descriptionCard: {
    marginBottom: 16,
    elevation: 2,

  },
  descriptionInput: {},
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
    marginBottom: 16,
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