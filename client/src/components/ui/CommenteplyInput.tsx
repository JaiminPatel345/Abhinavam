import {IconButton, TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";

interface ReplyInputProps {
  replyText: string;
  setReplyText: (text: string) => void;
  handleAddReply: (commentId: string) => void;
  commentId: string;
  closeReply: () => void;
}

const CommentReplyInput = ({
                             replyText,
                             setReplyText,
                             handleAddReply,
                             commentId,
                             closeReply
                           }: ReplyInputProps) => (
    <View style={styles.replyInputContainer}>
      <TextInput
          mode="outlined"
          placeholder="Write a reply..."
          value={replyText}
          onChangeText={setReplyText}
          style={styles.replyInput}
          dense
          right={
            <TextInput.Icon
                icon="send"
                onPress={() => handleAddReply(commentId)}
                disabled={!replyText.trim()}
                color={replyText.trim() ? "#3B82F6" : "#9CA3AF"}
            />
          }
      />
      <IconButton
          icon="close"
          size={20}
          onPress={closeReply}
          style={styles.closeReplyButton}
      />
    </View>
);

export default CommentReplyInput

const styles = StyleSheet.create({
  replyInputContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyInput: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  closeReplyButton: {
    marginLeft: 4,
  },

});
