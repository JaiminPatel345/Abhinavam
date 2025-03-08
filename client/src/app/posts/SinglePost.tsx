import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import {IPost, IPostReactionType} from "@/types/posts.types";
import {Feather, MaterialIcons} from "@expo/vector-icons";
import {format} from "date-fns";
import {useEffect, useRef, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import usePost from "@/hooks/usePost";
import {RootState} from "@/types/redux.types";
import {useDispatch, useSelector} from "react-redux";
import {likeAPost, unlikeAPost} from "@/redux/slice/postSlice";
import Comments from "@/app/posts/Comments";
import {showNotification} from "@/redux/slice/notificationSlice";
import {setCurrentRoute} from "@/redux/slice/navigationSlice";
import {router} from "expo-router";

const {width} = Dimensions.get("window");

const SinglePost = ({post, showConnect = false}: {
  post: IPost,
  showConnect?: boolean
}) => {
  // State for modal and image viewing
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [uniqueReactions, setUniqueReactions] = useState<IPostReactionType[]>([]);
  const [reactionCount, setReactionCount] = useState<number>(0);

  const {likedPosts} = useSelector((state: RootState) => state.posts);
  const {addReaction, removeReaction} = usePost();

  // Ref for FlatList
  const imageSlider = useRef(null);

  // Format timestamp
  const formattedDate = format(new Date(post.createdAt), "MMM d, yyyy");


  // Reaction emojis mapping
  const reactionEmojis = {
    [IPostReactionType.WOW]: "🔥",
    [IPostReactionType.VIBE]: "✨",
    [IPostReactionType.RESPECT]: "🙌",
    [IPostReactionType.INSPIRE]: "💫"
  };

  // Get user's current reaction if exists

  const userReaction: IPostReactionType = likedPosts[post._id];
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);


// Calculate initial values when the component renders or when post changes
  useEffect(() => {
    setUniqueReactions(Array.from(new Set(post.reactions.map(r => r.type))));
    setReactionCount(post.reactions.length);
  }, [post]);

  // Handle reactions
  const handleReaction = (reactionType: IPostReactionType) => {
    setShowReactions(false);

    if (userReaction === reactionType) {

      dispatch(unlikeAPost({postId: post._id}));
      removeReaction(post._id);

      // Update local reaction count and unique reactions
      setReactionCount(prevCount => prevCount - 1);

      // If this was the last reaction of this type, remove it from uniqueReactions
      const reactionTypeCount = post.reactions.filter(r => r.type === reactionType).length;
      if (reactionTypeCount <= 1) {
        setUniqueReactions(prevUnique => prevUnique.filter(type => type !== reactionType));
      }
    } else {

      // If user already had a different reaction, we need to replace it
      const hadPreviousReaction = userReaction !== undefined;
      if (user === null) {
        dispatch(showNotification({
          type: 'DANGER',
          title: 'Cannot like post',
          message: 'You must be logged in to like a post'
        }))
        return
      }

      dispatch(likeAPost({
        postId: post._id, type: reactionType, user: {
          username: user.username,
          avatar: {
            url: user.avatar?.url || ''
          }
        }
      }));
      addReaction({postId: post._id, type: reactionType});

      // If user had no previous reaction, increment count
      if (!hadPreviousReaction) {
        setReactionCount(prevCount => prevCount + 1);
      }

      //TODO: that one bug
      // Add this reaction type to uniqueReactions if not already present
      setUniqueReactions(prevUnique => {
        if (!prevUnique.includes(reactionType)) {
          return [...prevUnique, reactionType];
        }
        return prevUnique;
      });

      // If user had a previous reaction, check if we need to remove it from uniqueReactions
      if (hadPreviousReaction) {
        const previousReactionTypeCount = post.reactions.filter(r => r.type === userReaction).length;
        if (previousReactionTypeCount <= 1) {
          setUniqueReactions(prevUnique => prevUnique.filter(type => type !== userReaction));
        }
      }
    }


  };

  // Handle image view
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalVisible(true);
  };

  // Handle comment
  const handleComment = () => {
    setShowComments(!showComments);

  };

  // Handle share
  const handleShare = () => {
    console.log(`User wants to share post ${post._id}`);
  };

  // Handle image scroll
  const handleScroll = (event: any) => {
    const slideIndex = Math.round(
        event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setCurrentImageIndex(slideIndex);
  };

  const handleShowUserProfile = (username: string) => {
    if (username === user?.username) {
      dispatch(setCurrentRoute(`$/profile`))
      router.push(`/profile`)
      return
    }
    dispatch(setCurrentRoute(`$/user/{username}`))
    router.push(`/user/${username}`)
  }


  return (
      <View className={'rounded-xl shadow-sm mx-3  overflow-hidden'}>

        <View
            className="bg-background ">
          {/* Owner Header */}
          <View className="flex-row items-center p-4 border-b border-gray-200">
            <Image
                source={{uri: post.owner.avatar.url}}
                className="w-10 h-10 rounded-full"
                style={{width: 40, height: 40}}
            />
            <View className="ml-3 flex-1">
              <TouchableOpacity
                  onPress={() => handleShowUserProfile(post.owner.username)}>
                <Text
                    className="font-bold text-gray-800">{post.owner.username}
                </Text>
              </TouchableOpacity>
              {post.location && (
                  <View className="flex-row items-center">
                    <MaterialIcons name="location-on" size={12}
                                   color="#6B7280"/>
                    <Text className="text-xs text-gray-500 ml-1">
                      {`${post.location.city}, ${post.location.country}`}
                    </Text>
                  </View>
              )}
            </View>
            {showConnect && (
                <TouchableOpacity
                    onPress={() => console.log("Connect with user")}>
                  <LinearGradient
                      colors={['#8a2387', '#e94057', '#f27121']}
                      className="px-3 py-1 rounded-full"
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                  >
                    <Text
                        className="text-white font-medium text-xs">Connect</Text>
                  </LinearGradient>
                </TouchableOpacity>
            )}
          </View>

          {/* Description */}
          {post.description && (
              <View className="px-4 pt-3">
                <Text
                    className="text-gray-800 leading-5">{post.description}</Text>
                {post.tags && post.tags.length > 0 && (
                    <View className="flex-row flex-wrap mt-2">
                      {post.tags.map((tag, index) => (
                          <Text key={index}
                                className="text-blue-500 text-sm mr-2">
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
                          source={{uri: post.media[0].url}}
                          className="w-full"
                          style={{width: "100%", height: 300}}
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
                          renderItem={({item, index}) => (
                              <TouchableHighlight
                                  onPress={() => openImageViewer(index)}>
                                <Image
                                    source={{uri: item.url}}
                                    style={{width: width - 24, height: 250}}
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
                {reactionCount > 0 && (
                    <View className="flex-row">
                      {/* Show first 4 unique reaction types */}
                      {uniqueReactions.map((type, idx) => (
                          <Text key={idx} className="mr-1">

                            {reactionEmojis[type]}
                          </Text>
                      ))}
                    </View>
                )}
                <Text className="text-gray-600 font-medium ml-1">
                  {reactionCount} {post.reactions.length === 1 ? "reaction" : "reactions"}
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
          <View
              className="flex-row border-t border-gray-200 divide-x divide-gray-200">
            <View className="relative flex-1">
              <TouchableOpacity
                  className="py-3 flex-row justify-center items-center w-full"
                  onPress={() => setShowReactions(!showReactions)}
                  onLongPress={() => setShowReactions(true)}
              >
                <View>
                  {userReaction ? (
                      <View
                          className={'flex justify-center items-center bg-gray-300 h-12 w-12 rounded-full'}>
                        <Text
                            className=" text-white text-xl font-bold rounded-full px-2 py-1">
                          {reactionEmojis[userReaction]}
                        </Text>
                      </View>
                  ) : (
                      <View className={"relative flex-1 flex-row"}>
                        <Feather
                            name={"heart"}
                            size={18}
                            color="#e94057"
                        />
                        <Text className={`ml-2 font-medium text-gray-600`}>
                          React
                        </Text>
                      </View>
                  )}
                </View>

              </TouchableOpacity>

              {/* Reaction selector */}
              {showReactions && (
                  <View
                      className="absolute w-[240px] bottom-14 bg-gray-100 rounded-full flex-row p-2 mx-auto shadow-lg self-center left-4 right-4">
                    {Object.entries(reactionEmojis).map(([type, emoji]) => (
                        <TouchableOpacity
                            key={type}
                            className={`mx-2 items-center justify-center ${userReaction === type && "bg-blue-400"} rounded-full p-2`}
                            onPress={() => handleReaction(type as IPostReactionType)}
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
              <Feather name="message-circle" size={18} color="#6B7280"/>
              <Text className="ml-2 text-gray-600 font-medium">Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="flex-1 py-3 flex-row justify-center items-center"
                onPress={handleShare}
            >
              <Feather name="share" size={18} color="#6B7280"/>
              <Text className="ml-2 text-gray-600 font-medium">Share</Text>
            </TouchableOpacity>
          </View>

          {/*Comments*/}
          <View>
            {showComments && (
                <Comments postId={post._id}
                />
            )}
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
                  <Feather name="x" size={24} color="white"/>
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
                  renderItem={({item}) => (
                      <View style={{width, justifyContent: "center"}}>
                        <Image
                            source={{uri: item.url}}
                            style={{width, height: 400}}
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
      </View>


  );
};

export default SinglePost;