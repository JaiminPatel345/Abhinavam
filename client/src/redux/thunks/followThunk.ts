import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {userApi} from "@/api/userApi";
import {showNotification} from "@/redux/slice/notificationSlice";

export const fetchFollowingThunk = createAsyncThunk(
    'follow/fetchFollowing',
    async (username: string, {rejectWithValue}) => {
      try {
        const response = await userApi.getFollowing(username);
        return response.data.data.following;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
      }
    }
);

export const fetchFollowersThunk = createAsyncThunk(
    'follow/fetchFollowers',
    async (username: string, {rejectWithValue}) => {
      try {
        const response = await userApi.getFollowers(username);
        return response.data.data.followers;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
      }
    }
);

export const toggleFollowUserThunk = createAsyncThunk(
    'follow/toggleFollow',
    async (userId: string, {dispatch , rejectWithValue}) => {
      try {
        const response = await userApi.toggleFollow(userId)
        console.log("res",response.data.data)
        dispatch(showNotification({
          message: response.data.message,
          type: 'SUCCESS',
          title:'Success'
        }))
      } catch (error: any) {
        dispatch(showNotification({
          message: error.response?.data?.message || 'Failed to toggle follow',
          type: 'ERROR',
          title:'Failed'
        }))
        return rejectWithValue(error.response?.data?.message || 'Failed to toggle follow');
      }
    }
);