import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearViewedProfile,
  setUpdatingProfile,
  setUpdateError,
  updateProfileSuccess,
} from "../../slices/userSlice";
import {
  userService,
  type UpdateUserProfileRequest,
} from "../../services/userService";

export const UserProfileView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { viewedProfile, isUpdatingProfile, updateError } = useAppSelector(
    (state) => state.userProfile,
  );
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateUserProfileRequest>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const isOwnProfile = viewedProfile?.id === currentUser?.id;

  // Initialize form data when viewing profile
  useEffect(() => {
    if (viewedProfile) {
      setFormData({
        displayName: viewedProfile.displayName || "",
        bio: viewedProfile.bio || "",
        avatar: viewedProfile.avatar || "",
      });
      setValidationError(null);
    }
  }, [viewedProfile]);

  const handleEdit = () => {
    setIsEditMode(true);
    setValidationError(null);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setValidationError(null);
    if (viewedProfile) {
      setFormData({
        displayName: viewedProfile.displayName || "",
        bio: viewedProfile.bio || "",
        avatar: viewedProfile.avatar || "",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName?.trim()) {
      setValidationError("Display name is required");
      return;
    }

    if ((formData.bio || "").length > 500) {
      setValidationError("Bio must be 500 characters or less");
      return;
    }

    dispatch(setUpdatingProfile(true));
    try {
      const updatedProfile = await userService.updateMyProfile(formData);
      dispatch(updateProfileSuccess(updatedProfile));
      setIsEditMode(false);
      setValidationError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      dispatch(setUpdateError(errorMessage));
      setValidationError(errorMessage);
    }
  };

  if (!viewedProfile) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">User Profile</h2>
          <button
            onClick={() => dispatch(clearViewedProfile())}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Profile Content */}
        {!isEditMode ? (
          <div className="p-6">
            {/* Avatar */}
            {viewedProfile.avatar && (
              <div className="flex justify-center mb-4">
                <img
                  src={viewedProfile.avatar}
                  alt={viewedProfile.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}

            {/* Display Name */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Display Name</p>
              <p className="text-lg font-semibold">
                {viewedProfile.displayName || "Not set"}
              </p>
            </div>

            {/* Username */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Username</p>
              <p className="text-lg">@{viewedProfile.username}</p>
            </div>

            {/* Bio */}
            {viewedProfile.bio && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Bio</p>
                <p className="text-base text-gray-800 whitespace-pre-wrap">
                  {viewedProfile.bio}
                </p>
              </div>
            )}

            {/* Edit button (only for own profile) */}
            {isOwnProfile && (
              <button
                onClick={handleEdit}
                className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Avatar URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Display Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName || ""}
                onChange={handleInputChange}
                placeholder="Enter display name"
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bio Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {(formData.bio || "").length}/500
              </p>
            </div>

            {/* Error Messages */}
            {(validationError || updateError) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {validationError || updateError}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdatingProfile}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-blue-300"
              >
                {isUpdatingProfile ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
