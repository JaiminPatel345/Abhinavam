import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {Avatar, Card, Divider, IconButton, TextInput} from "react-native-paper";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import {IComment} from "@/types/posts.types";
import {
  ArrowDownRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon
} from "react-native-heroicons/outline";
import {HeartIcon as HeartIconSolid} from "react-native-heroicons/solid";
import useComments from '@/hooks/useComments';
import {showNotification} from "@redux/slice/notificationSlice";

interface CommentsProps {
  postId: string;
  onCommentsCountChange?: (count: number) => void;
}


const Comments = ({
                    postId,
                    onCommentsCountChange
                  }: CommentsProps) => {
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});


  const commentsForPost = Object.values(useSelector((state: RootState) => state.comments.comments[postId] || [], shallowEqual));


  // Animation values
  const heartScale = useRef<Record<string, Animated.Value>>({});

  const userId = useSelector((state: RootState) => state.user.user?._id);

  const likedComments = useSelector((state: RootState) => state.comments.likedComments);
  const isLoading = useSelector((state: RootState) => state.comments.isLoading);
  const dispatch = useDispatch();

  const {addComment, fetchComments, likeComment, unlikeComment} = useComments();

  // Filter root comments (no parent)
  const rootComments = commentsForPost.filter((comment: IComment) => !comment.parentComment) as IComment[];

  useEffect(() => {
    // Fetch root comments when component mounts
    fetchComments({postId, limit: 20, page: 1});
  }, [postId]);

  useEffect(() => {
    // Update parent component with comments count if needed
    if (onCommentsCountChange) {
      onCommentsCountChange(commentsForPost.length);
    }
  }, [commentsForPost.length]);

  // Create animation values for each comment
  useEffect(() => {
    commentsForPost.forEach((comment: IComment) => {
      if (!heartScale.current[comment._id]) {
        heartScale.current[comment._id] = new Animated.Value(1);
      }
    });
  }, [commentsForPost]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    addComment({
      postId,
      content: commentText
    }).then(() => {
      setCommentText('');
    });
  };

  const handleAddReply = (parentCommentId: string) => {
    if (!replyText.trim()) return;

    addComment({
      postId,
      content: replyText,
      parentComment: parentCommentId
    }).then(() => {
      setReplyText('');
      setReplyingTo(null);

      // Ensure replies are loaded and the parent comment is expanded
      loadReplies(parentCommentId);
      setExpandedComments(prev => ({
        ...prev,
        [parentCommentId]: true
      }));
    });
  };

  const handleLikeComment = (commentId: string) => {
    const isLiked = likedComments[commentId];
    console.log("is like : ",isLiked)

    // Start heart animation
    Animated.sequence([
      Animated.timing(heartScale.current[commentId], {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale.current[commentId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (!userId) {
      dispatch(showNotification({
        type: 'DANGER',
        title: 'Cannot like comment',
        message: 'You must be logged in to like a comment.'
      }))
      return;
    }
    // Update like status
    if (isLiked) {
      unlikeComment(commentId, userId);
    } else {
      likeComment(commentId, userId);
    }
  };

  const toggleReplies = (commentId: string) => {
    // If toggling open and we haven't loaded replies yet
    if (!expandedComments[commentId]) {
      loadReplies(commentId);
    }

    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const loadReplies = (commentId: string) => {
    setLoadingReplies(prev => ({...prev, [commentId]: true}));

    fetchComments({
      postId,
      parentComment: commentId,
      limit: 10,
      page: 1
    }).finally(() => {
      setLoadingReplies(prev => ({...prev, [commentId]: false}));
    });
  };

  const handleReplyPress = (commentId: string) => {
    // Toggle reply input visibility
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const renderReplies = (commentId: string) => {
    if (!expandedComments[commentId]) return null;

    const replies = commentsForPost.filter(
        (comment: IComment) => comment.parentComment === commentId
    ) as IComment[];

    if (loadingReplies[commentId]) {
      return (
          <View className="ml-10 mt-2">
            <ActivityIndicator size="small" color="#6200ee"/>
          </View>
      );
    }

    if (replies.length === 0) {
      return (
          <View className="ml-10 mt-2">
            <Text className="text-gray-500 text-sm">No replies yet</Text>
          </View>
      );
    }

    return (
        <View className="ml-6 mt-2 border-l-2 border-gray-200 pl-2">
          {replies.map(reply => renderCommentItem({
            item: reply,
            isReply: true
          }))}
        </View>
    );
  };

  const renderCommentItem = ({item, isReply = false}: {
    item: IComment,
    isReply?: boolean
  }) => {
    const isLiked = likedComments[item._id];
    const hasReplies = commentsForPost.some((comment: IComment) => comment.parentComment === item._id);
    const isExpanded = expandedComments[item._id];
    const isReplying = replyingTo === item._id;

    // Initialize animation value if needed
    if (!heartScale.current[item._id]) {
      heartScale.current[item._id] = new Animated.Value(1);
    }

    return (
        <Card key={item._id}
              className={`mb-2 mx-2  rounded-lg overflow-hidden ${isReply ? 'ml-0' : ''}`}>
          <Card.Content className="p-3">
            <View className="flex-row items-center mb-2">
              <Avatar.Image
                  size={isReply ? 32 : 40}
                  source={{uri: item.author.avatar.url || 'https://via.placeholder.com/40'}}
                  className="mr-3"
              />
              <View>
                <Text className="font-bold text-base text-gray-800">
                  {item.author.username}
                </Text>
                <Text className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                  {item.isEdited && " (edited)"}
                </Text>
              </View>
            </View>

            <Text className="text-gray-700 mb-2 leading-5">
              {item.content}
            </Text>

            <View className="flex-row items-center mt-1 justify-between">
              <View className="flex-row">
                <TouchableOpacity
                    onPress={() => handleLikeComment(item._id)}
                    className="flex-row items-center mr-4"
                >
                  <Animated.View
                      style={{transform: [{scale: heartScale.current[item._id]}]}}>
                    {isLiked ? (
                        <HeartIconSolid size={20} color="#FF3B30"/>
                    ) : (
                        <HeartIcon size={20} color="#6B7280"/>
                    )}
                  </Animated.View>
                  <Text
                      className={`ml-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                    {item.likes.length}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleReplyPress(item._id)}
                    className="flex-row items-center"
                >
                  <ArrowDownRightIcon size={20} color="#6B7280"/>
                  <Text className="ml-1 text-gray-500">Reply</Text>
                </TouchableOpacity>
              </View>

              {!isReply && hasReplies && (
                  <TouchableOpacity
                      onPress={() => toggleReplies(item._id)}
                      className="flex-row items-center"
                  >
                    <Text className="mr-1 text-blue-500">
                      {isExpanded ? "Hide replies" : "Show replies"}
                    </Text>
                    {isExpanded ? (
                        <ChevronUpIcon size={16} color="#3B82F6"/>
                    ) : (
                        <ChevronDownIcon size={16} color="#3B82F6"/>
                    )}
                  </TouchableOpacity>
              )}
            </View>

            {/* Reply input */}
            {isReplying && (
                <View className="mt-3 flex-row items-center">
                  <TextInput
                      mode="outlined"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChangeText={setReplyText}
                      className="flex-1  rounded-lg"
                      dense
                      right={
                        <TextInput.Icon
                            icon="send"
                            onPress={() => handleAddReply(item._id)}
                            disabled={!replyText.trim()}
                        />
                      }
                  />
                  <IconButton
                      icon="close"
                      size={20}
                      onPress={() => setReplyingTo(null)}
                  />
                </View>
            )}
          </Card.Content>

          {/* Replies container */}
          {!isReply && renderReplies(item._id)}
        </Card>
    );
  };

  return (
      <View className="bg-gray-100 pt-2 flex-1">
        <View className="px-4 mb-4">
          <TextInput
              mode="outlined"
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              className=" rounded-lg mb-2"
              right={
                <TextInput.Icon
                    icon="send"
                    onPress={handleAddComment}
                    disabled={!commentText.trim()}
                />
              }
          />
        </View>

        <Divider/>

        {isLoading && rootComments.length === 0 ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="large" color="#6200ee"/>
            </View>
        ) : (
            <FlatList
                data={rootComments}
                renderItem={(props) => renderCommentItem(props)}
                keyExtractor={(item) => item._id}
                className="mb-20"
                ListEmptyComponent={
                  <View className="py-8 items-center">
                    <Text className="text-gray-500">No comments yet. Be the
                      first!</Text>
                  </View>
                }
                refreshing={isLoading}
                onRefresh={() => fetchComments({postId, limit: 20, page: 1})}
            />
        )}
      </View>
  );
};

export default Comments;