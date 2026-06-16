import { userAxios } from "./axiosInstance";
import { API_ROUTES } from "../constants/routes";

// User Profile interfaces
export interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateUserProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

// Search result
export interface UserSearchResult {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
}

export const userService = {
  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    if (!query.trim()) {
      return [];
    }
    try {
      const response = await userAxios.get<UserSearchResult[]>(
        API_ROUTES.USERS.SEARCH(query),
      );
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  getUserProfile: async (id: string): Promise<UserProfile> => {
    try {
      const response = await userAxios.get<UserProfile>(
        API_ROUTES.USERS.GET_PROFILE(id),
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  updateMyProfile: async (
    data: UpdateUserProfileRequest,
  ): Promise<UserProfile> => {
    try {
      const response = await userAxios.put<UserProfile>(
        API_ROUTES.USERS.UPDATE_PROFILE,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  getMultipleUserProfiles: async (ids: string[]): Promise<UserProfile[]> => {
    if (ids.length === 0) return [];
    try {
      const response = await userAxios.post<UserProfile[]>(
        `${API_ROUTES.USERS.UPDATE_PROFILE.replace("/me", "")}/by-ids`,
        { ids },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching multiple profiles:", error);
      return [];
    }
  },
};
