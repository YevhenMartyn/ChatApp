import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile, UserSearchResult } from "../services/userService";

interface UserProfileState {
  searchResults: UserSearchResult[];
  viewedProfile: UserProfile | null;
  isLoadingSearch: boolean;
  isLoadingProfile: boolean;
  isUpdatingProfile: boolean;
  searchError: string | null;
  profileError: string | null;
  updateError: string | null;
}

const initialState: UserProfileState = {
  searchResults: [],
  viewedProfile: null,
  isLoadingSearch: false,
  isLoadingProfile: false,
  isUpdatingProfile: false,
  searchError: null,
  profileError: null,
  updateError: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<UserSearchResult[]>) => {
      state.searchResults = action.payload;
      state.isLoadingSearch = false;
      state.searchError = null;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSearch = action.payload;
    },
    setSearchError: (state, action: PayloadAction<string>) => {
      state.searchError = action.payload;
      state.isLoadingSearch = false;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    setViewedProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.viewedProfile = action.payload;
      state.isLoadingProfile = false;
      state.profileError = null;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingProfile = action.payload;
    },
    setProfileError: (state, action: PayloadAction<string>) => {
      state.profileError = action.payload;
      state.isLoadingProfile = false;
    },
    setUpdatingProfile: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingProfile = action.payload;
    },
    setUpdateError: (state, action: PayloadAction<string>) => {
      state.updateError = action.payload;
      state.isUpdatingProfile = false;
    },
    updateProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.viewedProfile = action.payload;
      state.isUpdatingProfile = false;
      state.updateError = null;
    },
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
      state.profileError = null;
    },
  },
});

export const {
  setSearchResults,
  setSearchLoading,
  setSearchError,
  clearSearchResults,
  setViewedProfile,
  setProfileLoading,
  setProfileError,
  setUpdatingProfile,
  setUpdateError,
  updateProfileSuccess,
  clearViewedProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
