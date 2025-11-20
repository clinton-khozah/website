import * as React from "react";
import {
  X,
  Globe,
  Link as LinkIcon,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Check,
  Loader2,
  Phone,
  MapPin,
  User,
  Languages,
  Target,
  DollarSign,
  BookOpen,
  Clock as ClockIcon,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VerificationPopup } from "./verification-popup";
import { LogoutConfirmationModal } from "./logout-confirmation-modal";
import { supabase } from "@/lib/supabase";

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    user_type: string;
    created_at: string;
    updated_at: string;
    verified: boolean | "pending" | "true" | "false";
    bio: string | null;
    website: string | null;
    phone_number?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    country?: string | null;
    city?: string | null;
    timezone?: string | null;
    native_language?: string | null;
    languages_spoken?: string | string[] | null;
    current_level?: string | null;
    interests?: string | string[] | null;
    learning_goals?: string | null;
    preferred_learning_style?: string | null;
    availability_hours?: string | null;
    budget_range?: string | null;
    social_links: Record<string, string> | string | null;
    settings: Record<string, any> | string | null;
    status?: string | null;
    is_complete?: boolean | null;
    role?: string | null;
  } | null;
  onVerificationSubmit?: () => void;
}

export function UserProfilePopup({
  isOpen,
  onClose,
  userData,
  onVerificationSubmit,
}: UserProfilePopupProps) {
  const [isVerificationOpen, setIsVerificationOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    full_name: userData?.full_name || "",
    website: userData?.website || "",
    bio: userData?.bio || "",
    social_links: userData?.social_links || {},
    phone_number: userData?.phone_number || "",
    country: userData?.country || "",
    city: userData?.city || "",
    current_level: userData?.current_level || "",
    languages_spoken: Array.isArray(userData?.languages_spoken)
      ? userData.languages_spoken.join(", ")
      : typeof userData?.languages_spoken === "string"
      ? userData.languages_spoken.replace(/[\[\]"]/g, "") || ""
      : "",
    interests: Array.isArray(userData?.interests)
      ? userData.interests.join(", ")
      : typeof userData?.interests === "string"
      ? userData.interests.replace(/[\[\]"]/g, "") || ""
      : "",
  });

  // Update form data when userData changes
  React.useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData.full_name || "",
        website: userData.website || "",
        bio: userData.bio || "",
        social_links: userData.social_links || {},
        phone_number: userData.phone_number || "",
        country: userData.country || "",
        city: userData.city || "",
        current_level: userData.current_level || "",
        languages_spoken: Array.isArray(userData.languages_spoken)
          ? userData.languages_spoken.join(", ")
          : typeof userData.languages_spoken === "string"
          ? userData.languages_spoken.replace(/[\[\]"]/g, "") || ""
          : "",
        interests: Array.isArray(userData.interests)
          ? userData.interests.join(", ")
          : typeof userData.interests === "string"
          ? userData.interests.replace(/[\[\]"]/g, "") || ""
          : "",
      });
    }
  }, [userData]);

  const handleVerificationSubmit = async (formData: any) => {
    if (!userData) return;
    try {
      setIsLoading(true);

      // Determine which table to update based on user type
      const isMentor =
        userData.user_type === "mentor" || userData.user_type === "tutor";
      const tableName = isMentor ? "mentors" : "students";
      const verifiedField = isMentor ? "is_verified" : "verified";

      const { error } = await supabase
        .from(tableName)
        .update({ [verifiedField]: "pending" })
        .eq("id", userData.id);

      if (error) throw error;

      if (onVerificationSubmit) {
        onVerificationSubmit();
      }
      setIsVerificationOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting verification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    try {
      setIsLoading(true);

      // Create an object with only the changed fields, using existing data as base
      const updates: Record<string, any> = {};

      // Only update fields that have changed and are not empty
      if (
        formData.full_name !== userData.full_name &&
        formData.full_name.trim() !== ""
      ) {
        updates.full_name = formData.full_name;
      }

      if (
        formData.website !== userData.website &&
        formData.website.trim() !== ""
      ) {
        updates.website = formData.website;
      }

      if (formData.bio !== userData.bio && formData.bio.trim() !== "") {
        updates.bio = formData.bio;
      }

      // Update phone_number
      if (formData.phone_number !== (userData.phone_number || "")) {
        updates.phone_number = formData.phone_number.trim() || null;
      }

      // Update country
      if (formData.country !== (userData.country || "")) {
        updates.country = formData.country.trim() || null;
      }

      // Update city
      if (formData.city !== (userData.city || "")) {
        updates.city = formData.city.trim() || null;
      }

      // Update current_level
      if (formData.current_level !== (userData.current_level || "")) {
        updates.current_level = formData.current_level.trim() || null;
      }

      // Update languages_spoken (convert comma-separated string to array)
      const currentLanguages = Array.isArray(userData.languages_spoken)
        ? userData.languages_spoken.join(", ")
        : typeof userData.languages_spoken === "string"
        ? userData.languages_spoken.replace(/[\[\]"]/g, "") || ""
        : "";
      if (formData.languages_spoken !== currentLanguages) {
        updates.languages_spoken = formData.languages_spoken.trim()
          ? formData.languages_spoken
              .split(",")
              .map((lang) => lang.trim())
              .filter(Boolean)
          : [];
      }

      // Update interests (convert comma-separated string to array)
      const currentInterests = Array.isArray(userData.interests)
        ? userData.interests.join(", ")
        : typeof userData.interests === "string"
        ? userData.interests.replace(/[\[\]"]/g, "") || ""
        : "";
      if (formData.interests !== currentInterests) {
        updates.interests = formData.interests.trim()
          ? formData.interests
              .split(",")
              .map((interest) => interest.trim())
              .filter(Boolean)
          : [];
      }

      // Only update social_links if it has changed and is not empty
      if (
        JSON.stringify(formData.social_links) !==
          JSON.stringify(userData.social_links) &&
        Object.keys(formData.social_links).length > 0
      ) {
        updates.social_links = formData.social_links;
      }

      // Only update if there are actual changes
      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString();

        // Determine which table to update based on user type
        const isMentor =
          userData.user_type === "mentor" || userData.user_type === "tutor";
        const tableName = isMentor ? "mentors" : "students";

        // For mentors, map full_name to name
        if (isMentor && updates.full_name) {
          updates.name = updates.full_name;
          delete updates.full_name;
        }

        const { error } = await supabase
          .from(tableName)
          .update(updates)
          .eq("id", userData.id);

        if (error) throw error;

        // Show success message first
        setShowSuccess(true);

        // Update the parent component's userData
        if (onVerificationSubmit) {
          onVerificationSubmit();
        }

        // Close the profile popup after a short delay
        setTimeout(() => {
          onClose();
        }, 500);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        // No changes were made
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVerificationStatus = () => {
    const verified = userData?.verified;
    // Handle both boolean and string values
    if (verified === true || verified === "true") {
      return {
        icon: CheckCircle,
        text: "Verified",
        color: "text-green-500",
        clickable: false,
      };
    } else if (verified === "pending") {
      return {
        icon: Clock,
        text: "Pending Verification",
        color: "text-blue-500",
        clickable: false,
      };
    } else {
      return {
        icon: XCircle,
        text: "Unverified",
        color: "text-yellow-500",
        clickable: true,
      };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
            <p className="text-white text-sm">Updating profile...</p>
          </div>
        </motion.div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 right-4 z-[100]"
        >
          <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-green-400 blur-xl opacity-30 rounded-lg" />

            {/* Main popup card - Light background */}
            <div className="relative bg-white border-2 border-green-400 rounded-lg p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                {/* Animated checkmark icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-400"
                >
                  <Check className="h-6 w-6 text-green-600" />
                </motion.div>

                {/* Success message */}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Profile Updated Successfully
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Changes have been saved to your profile
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-b-lg"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white border border-gray-200 rounded-xl p-6 z-50 shadow-2xl mx-auto"
          >
            {/* Header Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {/* Logout Button */}
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Loading State */}
            {!userData ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="ml-3 text-gray-600">Loading profile...</p>
              </div>
            ) : (
              <>
                {/* Profile Content */}
                {(() => {
                  const status = getVerificationStatus();
                  return (
                    <>
                      <div className="text-center mb-4">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          {userData.avatar_url ? (
                            <img
                              src={userData.avatar_url}
                              alt={userData.full_name || "User"}
                              className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center border-4 border-blue-200">
                              <span className="text-3xl font-medium text-white">
                                {(userData.full_name || "U")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div
                            className={`absolute bottom-1 right-1 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm ${
                              status.clickable
                                ? "cursor-pointer hover:bg-gray-50 transition-colors"
                                : ""
                            }`}
                            onClick={() => {
                              if (status.clickable) {
                                onClose();
                                setIsVerificationOpen(true);
                              }
                            }}
                          >
                            <status.icon size={12} className={status.color} />
                            <span
                              className={`text-xs font-medium ${status.color}`}
                            >
                              {status.text}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.full_name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  full_name: e.target.value,
                                })
                              }
                              className="text-xl font-bold text-gray-900 bg-white border border-gray-300 px-2 py-1 rounded text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder={userData.full_name}
                            />
                          ) : (
                            <h2 className="text-xl font-bold text-gray-900">
                              {userData.full_name}
                            </h2>
                          )}
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full">
                            {userData.user_type.charAt(0).toUpperCase() +
                              userData.user_type.slice(1)}
                          </span>
                        </div>

                        {/* About Section */}
                        <div className="bg-gray-50 rounded-lg p-4 mx-auto max-w-md border border-gray-200">
                          {isEditing ? (
                            <textarea
                              value={formData.bio}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  bio: e.target.value,
                                })
                              }
                              className="w-full bg-white text-gray-900 px-3 py-2 rounded text-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              rows={3}
                              placeholder={
                                userData.bio || "Add your bio here..."
                              }
                            />
                          ) : (
                            <p className="text-gray-600 text-sm leading-relaxed italic">
                              {userData.bio || "No bio provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* User Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Left Column */}
                        <div className="space-y-3">
                          {/* Email */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-blue-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Email
                              </h3>
                            </div>
                            <p className="text-gray-600 text-xs mt-1">
                              {userData.email}
                            </p>
                          </div>

                          {/* Phone Number */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-green-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Phone
                              </h3>
                            </div>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    phone_number: e.target.value,
                                  })
                                }
                                className="w-full bg-white text-gray-900 px-2 py-1 rounded mt-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="+1234567890"
                              />
                            ) : (
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.phone_number || "Not provided"}
                              </p>
                            )}
                          </div>

                          {/* Country */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-red-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Country
                              </h3>
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.country}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    country: e.target.value,
                                  })
                                }
                                className="w-full bg-white text-gray-900 px-2 py-1 rounded mt-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter country"
                              />
                            ) : (
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.country || "Not provided"}
                              </p>
                            )}
                          </div>

                          {/* City */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-orange-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                City
                              </h3>
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    city: e.target.value,
                                  })
                                }
                                className="w-full bg-white text-gray-900 px-2 py-1 rounded mt-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter city"
                              />
                            ) : (
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.city || "Not provided"}
                              </p>
                            )}
                          </div>

                          {/* Gender */}
                          {userData.gender && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-pink-500" />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Gender
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.gender}
                              </p>
                            </div>
                          )}

                          {/* Date of Birth */}
                          {userData.date_of_birth && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={14}
                                  className="text-indigo-500"
                                />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Date of Birth
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">
                                {formatDate(userData.date_of_birth)}
                              </p>
                            </div>
                          )}

                          {/* Current Level */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <BookOpen size={14} className="text-cyan-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Current Level
                              </h3>
                            </div>
                            {isEditing ? (
                              <select
                                value={formData.current_level}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    current_level: e.target.value,
                                  })
                                }
                                className="w-full bg-white text-gray-900 px-2 py-1 rounded mt-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                  Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                              </select>
                            ) : (
                              <p className="text-gray-600 text-xs mt-1 capitalize">
                                {userData.current_level || "Not specified"}
                              </p>
                            )}
                          </div>

                          {/* Member Since */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-yellow-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Member Since
                              </h3>
                            </div>
                            <p className="text-gray-600 text-xs mt-1">
                              {formatDate(userData.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                          {/* Website */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-blue-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Website
                              </h3>
                            </div>
                            {isEditing ? (
                              <input
                                type="url"
                                value={formData.website}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    website: e.target.value,
                                  })
                                }
                                className="w-full bg-white text-gray-900 px-2 py-1 rounded mt-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder={
                                  userData.website || "Add your website..."
                                }
                              />
                            ) : (
                              <a
                                href={userData.website || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-xs hover:underline mt-1 block"
                              >
                                {userData.website || "Not provided"}
                              </a>
                            )}
                          </div>

                          {/* Native Language */}
                          {userData.native_language && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <Languages
                                  size={14}
                                  className="text-purple-500"
                                />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Native Language
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.native_language}
                              </p>
                            </div>
                          )}

                          {/* Languages Spoken */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Languages size={14} className="text-teal-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Languages Spoken
                              </h3>
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.languages_spoken}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    languages_spoken: e.target.value,
                                  })
                                }
                                className="w-full bg-white text-gray-900 px-2 py-1 rounded mt-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., English, Spanish, French"
                              />
                            ) : (
                              <p className="text-gray-600 text-xs mt-1">
                                {Array.isArray(userData.languages_spoken)
                                  ? userData.languages_spoken.join(", ")
                                  : typeof userData.languages_spoken ===
                                    "string"
                                  ? userData.languages_spoken.replace(
                                      /[\[\]"]/g,
                                      ""
                                    ) || "Not specified"
                                  : "Not specified"}
                              </p>
                            )}
                          </div>

                          {/* Interests */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Target size={14} className="text-rose-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Interests
                              </h3>
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.interests}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    interests: e.target.value,
                                  })
                                }
                                className="w-full bg-white text-gray-900 px-2 py-1 rounded mt-1 text-xs border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., Reading, Music, Sports"
                              />
                            ) : (
                              <p className="text-gray-600 text-xs mt-1">
                                {Array.isArray(userData.interests)
                                  ? userData.interests.join(", ")
                                  : typeof userData.interests === "string"
                                  ? userData.interests.replace(
                                      /[\[\]"]/g,
                                      ""
                                    ) || "Not specified"
                                  : "Not specified"}
                              </p>
                            )}
                          </div>

                          {/* Learning Goals */}
                          {userData.learning_goals && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <Target size={14} className="text-amber-500" />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Learning Goals
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.learning_goals}
                              </p>
                            </div>
                          )}

                          {/* Preferred Learning Style */}
                          {userData.preferred_learning_style && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <BookOpen
                                  size={14}
                                  className="text-violet-500"
                                />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Learning Style
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.preferred_learning_style}
                              </p>
                            </div>
                          )}

                          {/* Budget Range */}
                          {userData.budget_range && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <DollarSign
                                  size={14}
                                  className="text-emerald-500"
                                />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Budget Range
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.budget_range}
                              </p>
                            </div>
                          )}

                          {/* Availability Hours */}
                          {userData.availability_hours && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <ClockIcon size={14} className="text-sky-500" />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Availability
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">
                                {userData.availability_hours}
                              </p>
                            </div>
                          )}

                          {/* Status */}
                          {userData.status && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <CheckCircle
                                  size={14}
                                  className="text-green-500"
                                />
                                <h3 className="text-xs font-medium text-gray-700">
                                  Status
                                </h3>
                              </div>
                              <p className="text-gray-600 text-xs mt-1 capitalize">
                                {userData.status}
                              </p>
                            </div>
                          )}

                          {/* Last Updated */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-purple-500" />
                              <h3 className="text-xs font-medium text-gray-700">
                                Last Updated
                              </h3>
                            </div>
                            <p className="text-gray-600 text-xs mt-1">
                              {formatDate(userData.updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Update Button */}
                      {isEditing && (
                        <div className="mt-6 flex justify-end gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateProfile}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </motion.div>
        </>
      )}

      {/* Verification Popup */}
      {userData && (
        <VerificationPopup
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          onSubmit={handleVerificationSubmit}
          userId={userData.id}
        />
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </AnimatePresence>
  );
}
