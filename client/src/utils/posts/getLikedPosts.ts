import {IPost, IPostReactionType} from "@/types/posts.types";

export const getLikedPosts = (posts: IPost[], username: string): Record<string, IPostReactionType> => {
  const likedPosts: Record<string, IPostReactionType> = {};

  // Only process reactions if user is logged in
  if (username) {
    // Process each post to find user reactions
    posts.forEach((post: IPost) => {
      const reaction = post.reactions.find(
          reaction => reaction.user.username === username
      );

      if (reaction) {
        likedPosts[post._id] = reaction.type;
      }
    });
  }

  return likedPosts;
}