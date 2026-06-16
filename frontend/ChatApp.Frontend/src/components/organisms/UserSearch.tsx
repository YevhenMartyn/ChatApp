import React, { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setSearchResults,
  setSearchLoading,
  setSearchError,
  clearSearchResults,
  setViewedProfile,
  setProfileLoading,
  setProfileError,
} from "../../slices/userSlice";
import {
  setActiveConversation,
  setLoadingConversations,
  addConversation,
} from "../../slices/chatSlice";
import { userService } from "../../services/userService";
import { chatService } from "../../services/chatService";

export const UserSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchResults, isLoadingSearch, searchError } = useAppSelector(
    (state) => state.userProfile,
  );
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        dispatch(clearSearchResults());
        setShowResults(false);
        return;
      }

      dispatch(setSearchLoading(true));
      try {
        const results = await userService.searchUsers(query);
        dispatch(setSearchResults(results));
        setShowResults(true);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Search failed";
        dispatch(setSearchError(errorMessage));
        setShowResults(true);
      }
    },
    [dispatch],
  );

  const handleViewProfile = useCallback(
    async (userId: string) => {
      if (userId === currentUser?.id) {
        return;
      }

      dispatch(setProfileLoading(true));
      try {
        const profile = await userService.getUserProfile(userId);
        dispatch(setViewedProfile(profile));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load profile";
        dispatch(setProfileError(errorMessage));
      }
    },
    [dispatch, currentUser?.id],
  );

  const handleStartChat = useCallback(
    async (userId: string) => {
      if (!userId || userId === currentUser?.id) {
        return;
      }

      setLoadingUserId(userId);
      try {
        dispatch(setLoadingConversations(true));
        const conversation = await chatService.startConversation({
          otherUserId: userId,
        });

        dispatch(addConversation(conversation));
        dispatch(setActiveConversation(conversation.id));

        setSearchQuery("");
        dispatch(clearSearchResults());
        setShowResults(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to start conversation";
        console.error(errorMessage);
      } finally {
        setLoadingUserId(null);
        dispatch(setLoadingConversations(false));
      }
    },
    [dispatch, currentUser?.id],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showResults]);

  return (
    <div className="search-container p-4 border-b">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {isLoadingSearch && (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            )}

            {searchError && (
              <div className="p-4 text-center text-red-500">{searchError}</div>
            )}

            {!isLoadingSearch &&
              !searchError &&
              searchResults.length === 0 &&
              searchQuery && (
                <div className="p-4 text-center text-gray-500">
                  No users found
                </div>
              )}

            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user.displayName || user.username}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      @{user.username}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-2 flex-shrink-0">
                  {currentUser?.id !== user.id && (
                    <>
                      <button
                        onClick={() => handleViewProfile(user.id)}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleStartChat(user.id)}
                        disabled={loadingUserId === user.id}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                      >
                        {loadingUserId === user.id ? "..." : "Message"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
