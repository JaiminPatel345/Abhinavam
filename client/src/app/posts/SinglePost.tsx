import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { IPost, PostReactionType, IReaction } from "@/types/posts.types";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const SinglePost = ({ post }: { post: IPost }) => {
  // State for modal and image viewing
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReactions, setShowReactions] = useState(false);

  // Ref for FlatList
  const imageSlider = useRef(null);

  // Format timestamp
  const formattedDate = format(new Date(post.createdAt), "MMM d, yyyy");

  // Reaction emojis mapping
  const reactionEmojis = {
    [PostReactionType.WOW]: "🔥",
    [PostReactionType.VIBE]: "✨",
    [PostReactionType.RESPECT]: "🙌",
    [PostReactionType.INSPIRE]: "💫"
  };

  // Get user's current reaction if exists
  const userReaction = post.reactions.length > 0 ? post.reactions[0]?.type : null;

  // Handle reactions
  const handleReaction = (reactionType: PostReactionType) => {
    console.log(`User reacted with ${reactionType} to post ${post._id}`);
    setShowReactions(false);
  };

  // Handle image view
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalVisible(true);
  };

  // Handle comment
  const handleComment = () => {
    console.log(`User wants to comment on post ${post._id}`);
  };

  // Handle share
  const handleShare = () => {
    console.log(`User wants to share post ${post._id}`);
  };

  // Handle image scroll
  const handleScroll = (event:any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setCurrentImageIndex(slideIndex);
  };

  return (
    <View className="bg-background rounded-xl shadow-sm mx-3 my-2 overflow-hidden" >
      {/* Owner Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Image
          source={{ uri: post.owner.avatar.url }}
          className="w-10 h-10 rounded-full"
          style={{ width: 40, height: 40 }}
        />
        <View className="ml-3 flex-1">
          <Text className="font-bold text-gray-800">{post.owner.username}</Text>
          {post.location && (
            <View className="flex-row items-center">
              <MaterialIcons name="location-on" size={12} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1">
                {`${post.location.city}, ${post.location.country}`}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => console.log("Connect with user")}>
          <LinearGradient
            colors={['#8a2387', '#e94057', '#f27121']}
            className="px-3 py-1 rounded-full"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text className="text-white font-medium text-xs">Connect</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Description */}
      {post.description && (
        <View className="px-4 pt-3">
          <Text className="text-gray-800 leading-5">{post.description}</Text>
          {post.tags && post.tags.length > 0 && (
            <View className="flex-row flex-wrap mt-2">
              {post.tags.map((tag, index) => (
                <Text key={index} className="text-blue-500 text-sm mr-2">
                  #{tag}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <View className="mt-3">
          {post.media.length === 1 ? (
            <TouchableHighlight onPress={() => openImageViewer(0)}>
              <Image
                source={{ uri: post.media[0].url }}
                className="w-full"
                style={{ width: "100%", height: 300 }}
                resizeMode="cover"
              />
            </TouchableHighlight>
          ) : (
            <View>
              <FlatList
                ref={imageSlider}
                data={post.media}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={({ item, index }) => (
                  <TouchableHighlight onPress={() => openImageViewer(index)}>
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: width - 24, height: 250 }}
                      resizeMode="cover"
                    />
                  </TouchableHighlight>
                )}
                keyExtractor={(item, index) => item._id || index.toString()}
              />

              {/* Pagination dots */}
              <View className="flex-row justify-center my-2">
                {post.media.map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      currentImageIndex === index ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Engagement Stats */}
      <View className="px-4 py-3 mt-2 border-t border-gray-200">
        <View className="flex-row justify-between">
          {/* Reactions count */}
          <View className="flex-row items-center">
            {post.reactions.length > 0 && (
              <View className="flex-row">
                {/* Show first 3 unique reaction types */}
                {Array.from(new Set(post.reactions.map(r => r.type))).slice(0, 3).map((type, idx) => (
                  <Text key={idx} className="mr-1">
                    {reactionEmojis[type]}
                  </Text>
                ))}
              </View>
            )}
            <Text className="text-gray-600 font-medium ml-1">
              {post.reactions.length} {post.reactions.length === 1 ? "reaction" : "reactions"}
            </Text>
          </View>

          {/* Comments and shares count */}
          <View className="flex-row">
            <Text className="text-gray-500 text-sm">
              {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
            </Text>
            <Text className="text-gray-500 text-sm ml-3">
              {post.shares} {post.shares === 1 ? "share" : "shares"}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row border-t border-gray-200 divide-x divide-gray-200">
        <View className="relative flex-1">
          <TouchableOpacity
            className="py-3 flex-row justify-center items-center w-full"
            onPress={() => setShowReactions(!showReactions)}
            onLongPress={() => setShowReactions(true)}
          >
            <Feather
              name={userReaction ? "heart" : "heart"}
              size={18}
              color={userReaction ? "#e94057" : "#6B7280"}
            />
            <Text className={`ml-2 font-medium ${userReaction ? "text-rose-500" : "text-gray-600"}`}>
              {userReaction ? reactionEmojis[userReaction] : "React"}
            </Text>
          </TouchableOpacity>

          {/* Reaction selector */}
          {showReactions && (
            <View className="absolute w-[180px] bottom-14 bg-gray-100 rounded-full flex-row p-2 mx-auto shadow-lg self-center left-4 right-4">
              {Object.entries(reactionEmojis).map(([type, emoji]) => (
                <TouchableOpacity
                  key={type}
                  className="mx-2 items-center justify-center"
                  onPress={() => handleReaction(type as PostReactionType)}
                >
                  <Text className="text-2xl">{emoji}</Text>
                  <Text className="text-xs mt-1">{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          className="flex-1 py-3 flex-row justify-center items-center"
          onPress={handleComment}
        >
          <Feather name="message-circle" size={18} color="#6B7280" />
          <Text className="ml-2 text-gray-600 font-medium">Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 py-3 flex-row justify-center items-center"
          onPress={handleShare}
        >
          <Feather name="share" size={18} color="#6B7280" />
          <Text className="ml-2 text-gray-600 font-medium">Share</Text>
        </TouchableOpacity>
      </View>

      {/* Image Viewer Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <View className="flex-row justify-end p-4">
            <TouchableOpacity onPress={() => setImageModalVisible(false)}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={post.media}
            horizontal
            pagingEnabled
            initialScrollIndex={currentImageIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={{ width, justifyContent: "center" }}>
                <Image
                  source={{ uri: item.url }}
                  style={{ width, height: 400 }}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(item, index) => item._id || index.toString()}
          />

          {/* Pagination indicator */}
          <View className="absolute bottom-10 left-0 right-0">
            <Text className="text-white text-center">
              {currentImageIndex + 1} / {post.media.length}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SinglePost;