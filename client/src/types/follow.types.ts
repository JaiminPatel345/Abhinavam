export interface UserRelation {
  _id: string;
  username: string;
  name: string;
  avatar?: {
    url: string,
    public_id: string
  };
}

export interface FollowState {
  following: UserRelation[];
  followers: UserRelation[];
  isLoadingFollowing: boolean;
  isLoadingFollowers: boolean;
  followError: string | null;
  userFollowers: Record<string, boolean>
}

