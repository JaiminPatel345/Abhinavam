import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import { Avatar, Card, Divider, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types/redux.types";
import { IComment } from "@/types/posts.types";
import {
  ArrowDownRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
} from "react-native-heroicons/outline";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import useComments from '@/hooks/useComments';
import { showNotification } from "@redux/slice/notificationSlice";
import CommentReplyInput from "@components/ui/CommenteplyInput";

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6200ee"/>
  </View>
);

const EmptyComments = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
  </View>
);

interface CommentsProps {
  postId: string;
  onCommentsCountChange?: (count: number) => void;
}

const Comments = ({
  postId,
  onCommentsCountChange
}: CommentsProps) => {
  // State for user input
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // UI state management
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  // Animation refs
  const heartScale = useRef<Record<string, Animated.Value>>({});
  const flatListRef = useRef<FlatList>(null);

  // Redux state
  const commentsMap = useSelector((state: RootState) => state.comments.comments[postId] || {});
  const commentReplies = useSelector((state: RootState) => state.comments.commentReplies);
  const userId = useSelector((state: RootState) => state.user.user?._id);
  const likedComments = useSelector((state: RootState) => state.comments.likedComments);
  const isLoading = useSelector((state: RootState) => state.comments.isLoading);
  const dispatch = useDispatch();

  // Custom hook for comment operations
  const { addComment, fetchComments, fetchReplies, likeComment, unlikeComment } = useComments();

  // Derived state
  const commentsArray = Object.values(commentsMap);
  const rootComments = commentsArray.filter((comment: IComment) => !comment.parentComment);

  // Initialize animation values for all comments
  useEffect(() => {
    commentsArray.forEach((comment: IComment) => {
      if (!heartScale.current[comment._id]) {
        heartScale.current[comment._id] = new Animated.Value(1);
      }
    });

    // Also initialize animations for replies
    Object.values(commentReplies).forEach(replies => {
      replies.forEach(reply => {
        if (!heartScale.current[reply._id]) {
          heartScale.current[reply._id] = new Animated.Value(1);
        }
      });
    });
  }, [commentsArray, commentReplies]);

  // Initial fetch - get only root comments
  useEffect(() => {
    fetchComments({
      postId,
      limit: 20,
      page: 1,
    });

    return () => {
      // Cleanup animation values to prevent memory leaks
      heartScale.current = {};
    };
  }, [postId]);

  // Update parent component with total comment count
  useEffect(() => {
    if (onCommentsCountChange) {
      onCommentsCountChange(commentsArray.length);
    }
  }, [commentsArray.length, onCommentsCountChange]);

  // Handler functions
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    try {
      addComment({
        postId,
        content: commentText
      });
      setCommentText('');

      // Scroll to the bottom to show the new comment
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 300);
    } catch (error) {
      console.error('Error adding comment:', error);
      dispatch(showNotification({
        type: 'DANGER',
        title: 'Error',
        message: 'Failed to add comment. Please try again.'
      }));
    }
  };

  const handleAddReply = (parentCommentId: string) => {
    if (!replyText.trim()) return;
    console.log("came")
    try {
      // Add the reply
      addComment({
        postId,
        content: replyText,
        parentComment: parentCommentId
      });

      setReplyText('');
      setReplyingTo(null);

      // Load replies immediately - don't wait
      loadReplies(parentCommentId);

      // Ensure the parent comment is expanded
      setExpandedComments(prev => ({
        ...prev,
        [parentCommentId]: true
      }));
    } catch (error) {
      console.error('Error adding reply:', error);
      dispatch(showNotification({
        type: 'DANGER',
        title: 'Error',
        message: 'Failed to add reply. Please try again.'
      }));
    }
  };

  const handleLikeComment = (commentId: string) => {
    const isLiked = likedComments[commentId];

    // Animate heart icon
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
      }));
      return;
    }

    // Call the appropriate like/unlike function - no await
    if (isLiked) {
      unlikeComment(commentId, userId);
    } else {
      likeComment(commentId, userId);
    }
  };

  const toggleReplies = (commentId: string) => {
    // If toggling open and replies not loaded yet
    if (!expandedComments[commentId] && (!commentReplies[commentId] || commentReplies[commentId].length === 0)) {
      loadReplies(commentId);
    }

    // Toggle the expanded state regardless
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const loadReplies = (commentId: string) => {
    // Don't reload if already loading
    if (loadingReplies[commentId]) return;

    setLoadingReplies(prev => ({...prev, [commentId]: true}));

    try {
      fetchReplies({
        commentId,
        limit: 50,
        page: 1
      });
    } catch (error) {
      console.error('Error loading replies:', error);
      dispatch(showNotification({
        type: 'DANGER',
        title: 'Error',
        message: 'Failed to load replies. Please try again.'
      }));
    } finally {
      setLoadingReplies(prev => ({...prev, [commentId]: false}));
    }
  };

  const handleReplyPress = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleRefresh = () => {
    setRefreshing(true);

    try {
      // Clear expanded comments state
      setExpandedComments({});

      // Re-fetch comments from scratch - no await
      fetchComments({
        postId,
        limit: 20,
        page: 1,
      });
    } catch (error) {
      console.error('Error refreshing comments:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Find the like count for a comment
  const getLikeCount = (comment: IComment) => {
    // For root comments, we can access the comment directly in commentsMap
    if (!comment.parentComment) {
      return commentsMap[comment._id]?.likes.length || comment.likes.length;
    }

    // For replies, we need to check the commentReplies
    const parentId = comment.parentComment;
    if (commentReplies[parentId]) {
      const reply = commentReplies[parentId].find(r => r._id === comment._id);
      return reply?.likes.length || comment.likes.length;
    }

    return comment.likes.length;
  };

  // Render functions
  const renderReplies = (commentId: string) => {
    if (!expandedComments[commentId]) return null;

    const replies = commentReplies[commentId] || [];

    if (loadingReplies[commentId]) {
      return (
        <View style={styles.repliesLoading}>
          <ActivityIndicator size="small" color="#6200ee"/>
        </View>
      );
    }

    if (replies.length === 0) {
      return (
        <View style={styles.repliesEmpty}>
          <Text style={styles.repliesEmptyText}>No replies yet</Text>
        </View>
      );
    }

    return (
      <View style={styles.repliesContainer}>
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
    const hasReplies = !!commentReplies[item._id]?.length || (item.replies && item.replies.length > 0);
    const replyCount = (commentReplies[item._id]?.length || item.replies?.length || 0);
    const isExpanded = expandedComments[item._id];
    const isReplying = replyingTo === item._id;
    const likeCount = getLikeCount(item);

    // Initialize animation value if needed
    if (!heartScale.current[item._id]) {
      heartScale.current[item._id] = new Animated.Value(1);
    }

    return (
      <Card key={item._id} style={[styles.commentCard, isReply && styles.replyCard]}>
        <Card.Content style={styles.cardContent}>
          {/* User info section */}
          <View style={styles.userInfoContainer}>
            <Avatar.Image
              size={isReply ? 28 : 36}
              source={{uri: item.author.avatar?.url || 'https://via.placeholder.com/40'}}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>
                {item.author.username}
              </Text>
              <Text style={styles.timeText}>
                {new Date(item.createdAt).toLocaleDateString()}
                {item.isEdited && " (edited)"}
              </Text>
            </View>
          </View>

          {/* Comment content */}
          <Text style={styles.commentText}>
            {item.content}
          </Text>

          {/* Actions row */}
          <View style={styles.actionsContainer}>
            <View style={styles.actionButtonsLeft}>
              <TouchableOpacity
                onPress={() => handleLikeComment(item._id)}
                style={styles.likeButton}
              >
                <Animated.View
                  style={{transform: [{scale: heartScale.current[item._id]}]}}>
                  {isLiked ? (
                    <HeartIconSolid size={18} color="#FF3B30"/>
                  ) : (
                    <HeartIcon size={18} color="#6B7280"/>
                  )}
                </Animated.View>
                <Text
                  style={[styles.likeCount, isLiked && styles.likedText]}>
                  {likeCount}
                </Text>
              </TouchableOpacity>

              {/* Only show Reply button if this is not already a reply */}
              {!isReply && (
                <TouchableOpacity
                  onPress={() => handleReplyPress(item._id)}
                  style={styles.replyButton}
                >
                  <ArrowDownRightIcon size={18} color="#6B7280"/>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Show/hide replies button */}
            {!isReply && (hasReplies || replyCount > 0) && (
              <TouchableOpacity
                onPress={() => toggleReplies(item._id)}
                style={styles.toggleRepliesButton}
              >
                <Text style={styles.toggleRepliesText}>
                  {isExpanded ? "Hide replies" : `Show replies (${replyCount})`}
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
            <CommentReplyInput
              replyText={replyText}
              setReplyText={setReplyText}
              handleAddReply={handleAddReply}
              commentId={item._id}
              closeReply={() => setReplyingTo(null)}
            />
          )}
        </Card.Content>

        {/* Replies container */}
        {!isReply && renderReplies(item._id)}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Comment input */}
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
          style={styles.commentInput}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleAddComment}
              disabled={!commentText.trim()}
              color={commentText.trim() ? "#3B82F6" : "#9CA3AF"}
            />
          }
        />
      </View>

      <Divider />

      {/* Comments list */}
      {isLoading && rootComments.length === 0 ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          ref={flatListRef}
          data={rootComments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<EmptyComments />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          ListHeaderComponent={refreshing ? <ActivityIndicator style={styles.refreshIndicator} color="#6200ee" /> : null}
          extraData={[likedComments, expandedComments, commentReplies]}
        />
      )}
    </View>
  );
};

// Styles extracted for better organization and performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  inputContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  commentInput: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: 80,
  },
  commentCard: {
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  replyCard: {
    marginLeft: 0,
    borderLeftWidth: 0,
  },
  cardContent: {
    padding: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 10,
  },
  username: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1F2937',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionButtonsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  likedText: {
    color: '#FF3B30',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  replyButtonText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  toggleRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleRepliesText: {
    marginRight: 4,
    fontSize: 13,
    color: '#3B82F6',
  },
  closeReplyButton: {
    marginLeft: 4,
  },
  repliesContainer: {
    marginLeft: 16,
    marginTop: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
    paddingLeft: 8,
  },
  repliesLoading: {
    marginLeft: 24,
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  repliesEmpty: {
    marginLeft: 24,
    marginTop: 8,
    paddingVertical: 8,
  },
  repliesEmptyText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIndicator: {
    marginVertical: 16,
  },
});

export default Comments;