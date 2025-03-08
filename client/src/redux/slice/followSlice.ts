import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  fetchFollowersThunk,
  fetchFollowingThunk,
  toggleFollowUserThunk
} from '../thunks/followThunk';
import {FollowState, UserRelation} from "@/types/follow.types";

// Initial State
const initialState: FollowState = {
  following: [],
  followers: [],
  isLoadingFollowing: false,
  isLoadingFollowers: false,
  followError: null
};


// Slice
const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    clearFollowErrors: (state) => {
      state.followError = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Following
    builder.addCase(fetchFollowingThunk.pending, (state) => {
      state.isLoadingFollowing = true;
      state.followError = null;
    });
    builder.addCase(fetchFollowingThunk.fulfilled, (state, action) => {
      state.isLoadingFollowing = false;
      state.following = action.payload;
    });
    builder.addCase(fetchFollowingThunk.rejected, (state, action) => {
      state.isLoadingFollowing = false;
      state.followError = action.payload as string;
    });

    // Fetch Followers
    builder.addCase(fetchFollowersThunk.pending, (state) => {
      state.isLoadingFollowers = true;
      state.followError = null;
    });
    builder.addCase(fetchFollowersThunk.fulfilled, (state, action) => {
      state.isLoadingFollowers = false;
      state.followers = action.payload;
    });
    builder.addCase(fetchFollowersThunk.rejected, (state, action) => {
      state.isLoadingFollowers = false;
      state.followError = action.payload as string;
    });

    // Toggle Follow
    builder.addCase(toggleFollowUserThunk.fulfilled, (state, action: PayloadAction<{
      user: UserRelation,
      isFollowing: boolean
    }>) => {
      const {user, isFollowing} = action.payload;

      if (isFollowing) {
        // Add to following list if not already exists
        if (!state.following.some(f => f._id === user._id)) {
          state.following.push(user);
        }
      } else {
        // Remove from following list
        state.following = state.following.filter(f => f._id !== user._id);
      }
    });
  }
});

export const {clearFollowErrors} = followSlice.actions;

export default followSlice.reducer;