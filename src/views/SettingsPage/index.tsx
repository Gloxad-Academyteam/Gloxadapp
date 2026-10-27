"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  FaUpload, FaEye, FaEyeSlash, FaChevronDown, 
  FaGlobe, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaWhatsapp, FaYoutube 
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { useS3Upload } from "@hooks/useS3Upload";
import { useQueryClient } from "@tanstack/react-query";
import { updatePassword, updateProfile } from "@services/auth";
import AvatarPlaceholder from "@assets/images/image.png";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const SettingsPage = () => {
  const { authenticatedUser, handleLogout } = useAuth();
  const { uploadFile, isUploading: isUploadingAvatar } = useS3Upload();
  const queryClient = useQueryClient();
  const user: any = authenticatedUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneCode: "+880",
    phoneNumber: "",
    title: "",
    skills: "",
    biography: "",
    avatarUrl: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    whatsapp: "",
    youtube: "",
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    coursePurchases: true,
    courseReviews: true,
    lectureComments: true,
    lectureNotesDownloads: true,
    commentReplies: true,
    dailyProfileVisits: false,
    lectureFileDownloads: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        phoneCode: "+880",
        phoneNumber: user.phoneNumber || "",
        title: user.title || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
        biography: user.biography || "",
        avatarUrl: user.avatarUrl || user.avatar || "",
        website: user?.socialLinks?.website || "",
        facebook: user?.socialLinks?.facebook || "",
        instagram: user?.socialLinks?.instagram || "",
        linkedin: user?.socialLinks?.linkedin || "",
        twitter: user?.socialLinks?.twitter || "",
        whatsapp: user?.socialLinks?.whatsapp || "",
        youtube: user?.socialLinks?.youtube || "",
      });

      if (user.notificationPreferences) {
        setNotificationPreferences({
          coursePurchases: user.notificationPreferences.coursePurchases ?? true,
          courseReviews: user.notificationPreferences.courseReviews ?? true,
          lectureComments: user.notificationPreferences.lectureComments ?? true,
          lectureNotesDownloads: user.notificationPreferences.lectureNotesDownloads ?? true,
          commentReplies: user.notificationPreferences.commentReplies ?? true,
          dailyProfileVisits: user.notificationPreferences.dailyProfileVisits ?? false,
          lectureFileDownloads: user.notificationPreferences.lectureFileDownloads ?? true,
        });
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 50) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be under 5MB");
      return;
    }
    
    e.target.value = "";
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    // Immediately reveal the picture so tutors see their photo right away!
    const previousUrl = formData.avatarUrl;
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatarUrl: previewUrl }));

    try {
      const url = await uploadFile(file, "avatars");
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      await updateProfile({ avatarUrl: url });
      queryClient.invalidateQueries({ queryKey: ["auth.me"] });
      toast.success("Profile picture saved!");
    } catch (error: any) {
      setFormData((prev) => ({ ...prev, avatarUrl: previousUrl }));
      toast.error(error?.response?.data?.error || "Failed to save profile picture. Please try again.");
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        title: formData.title,
        skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        biography: formData.biography,
      };

      await updateProfile(payload);
      queryClient.invalidateQueries({ queryKey: ["auth.me"] });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsPasswordLoading(true);
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSocialLoading(true);
    try {
      const payload = {
        socialLinks: {
          website: formData.website,
          facebook: formData.facebook,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          whatsapp: formData.whatsapp,
          youtube: formData.youtube,
        }
      };
      await updateProfile(payload);
      queryClient.invalidateQueries({ queryKey: ["auth.me"] });
      toast.success("Social profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update social profile");
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotificationsLoading(true);
    try {
      const payload = {
        notificationPreferences
      };
      await updateProfile(payload);
      queryClient.invalidateQueries({ queryKey: ["auth.me"] });
      toast.success("Notification preferences updated successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update notification preferences");
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1512px] px-5 md:px-10 lg:px-[120px] pt-8 pb-24">
      
      {/* Account Settings Card */}
      <div className="bg-white rounded-[12px] border border-[#dedee7] shadow-sm mb-8 p-6 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Left: Form */}
        <div className="flex-1 order-2 md:order-1">
          <h2 className="text-[20px] font-bold text-[#202127] mb-6">Account Settings</h2>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
            {/* Full name */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Full name</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className="h-11 px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className="h-11 px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              </div>
            </div>
            
            {/* Username */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Username</label>
              <input required type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Enter your username" className="w-full h-11 px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Phone Number</label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={formData.phoneNumber}
                onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value || "" }))}
                className="flex items-center h-11 px-4 border border-[#dedee7] rounded-[6px] bg-white focus-within:border-[#181C7B] transition-colors text-[14px] outline-none"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Title</label>
              <div className="flex items-center border border-[#dedee7] rounded-[6px] pl-4 pr-3 bg-white focus-within:border-[#181C7B] transition-colors">
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Your tittle, proffesion or small biography" className="flex-1 h-11 bg-transparent text-[14px] outline-none" />
                <span className="text-[12px] text-[#4e515c] font-medium ml-2">{formData.title.length}/50</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Skills</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="e.g. UI/UX, Figma, React" className="w-full h-11 px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              <p className="text-[12px] text-[#717480] mt-1">Separate skills with commas</p>
            </div>

            {/* Biography */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Biography</label>
              <textarea name="biography" value={formData.biography} onChange={handleInputChange} placeholder="Your tittle, proffesion or small biography" className="w-full h-[120px] p-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors resize-none"></textarea>
            </div>

            <div className="mt-2">
              <button disabled={isLoading} type="submit" className="h-11 px-8 rounded-[6px] bg-[#0a1b56] text-white text-[14px] font-medium transition hover:bg-[#07004d] disabled:opacity-70">
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Avatar */}
        <div className="w-full md:w-[280px] shrink-0 order-1 md:order-2">
          <div className="w-full bg-[#f5f6f8] rounded-[8px] p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
            <div className={`w-full aspect-square bg-[#eaf2fd] overflow-hidden relative mb-4 shadow-sm rounded-[8px] transition-all duration-300 ${isUploadingAvatar ? "ring-4 ring-[#3e92cc] ring-offset-2" : "border border-[#dedee7]"}`}>
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={AvatarPlaceholder.src} alt="Profile Placeholder" className="w-full h-full object-cover opacity-80" />
              )}
              
              {/* Colorful Progress Overlay when Saving */}
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#181C7B]/80 via-[#3e92cc]/40 to-transparent flex flex-col items-center justify-center backdrop-blur-[2px] transition-all z-10">
                  <div className="w-10 h-10 border-4 border-white/30 border-t-[#3e92cc] rounded-full animate-spin mb-2 shadow-lg"></div>
                  <span className="text-white text-[13px] font-bold tracking-wide drop-shadow-md">Saving photo...</span>
                </div>
              )}

              {/* Upload Overlay (shown when NOT uploading) */}
              {!isUploadingAvatar && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 left-0 right-0 h-[40px] bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 text-white text-[12px] font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Upload Photo
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploadingAvatar} />
            </div>
            <p className="text-[10px] text-[#717480] text-center leading-[1.6]">
              Image size should be under 5MB<br/>and image ratio needs to be 1:1
            </p>
          </div>
        </div>
      </div>

      {/* Social Profile Card */}
      <div className="bg-white rounded-[12px] border border-[#dedee7] shadow-sm mb-8 p-6 md:p-8">
        <h2 className="text-[20px] font-bold text-[#202127] mb-6">Social Profile</h2>
        <form onSubmit={handleSocialSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Personal Website</label>
            <div className="flex items-center gap-3">
              <div className="w-[44px] h-[44px] shrink-0 bg-[#f5f6f8] border border-[#dedee7] flex items-center justify-center rounded-[6px]">
                <FaGlobe className="text-[#4e515c] text-[20px]" />
              </div>
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} placeholder="Personal website or portfolio url..." className="flex-1 h-[44px] px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Facebook */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Facebook</label>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] shrink-0 bg-[#f5f6f8] border border-[#dedee7] flex items-center justify-center rounded-[6px]">
                  <FaFacebookF className="text-[#1877F2] text-[20px]" />
                </div>
                <input type="text" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="Username" className="flex-1 h-[44px] px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              </div>
            </div>
            {/* Instagram */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Instagram</label>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] shrink-0 bg-[#f5f6f8] border border-[#dedee7] flex items-center justify-center rounded-[6px]">
                  <FaInstagram className="text-[#E4405F] text-[20px]" />
                </div>
                <input type="text" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="Username" className="flex-1 h-[44px] px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              </div>
            </div>
            {/* Linkedin */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Linkedin</label>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] shrink-0 bg-[#f5f6f8] border border-[#dedee7] flex items-center justify-center rounded-[6px]">
                  <FaLinkedinIn className="text-[#0A66C2] text-[20px]" />
                </div>
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="Username" className="flex-1 h-[44px] px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              </div>
            </div>
            {/* Twitter */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Twitter</label>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] shrink-0 bg-[#f5f6f8] border border-[#dedee7] flex items-center justify-center rounded-[6px]">
                  <FaTwitter className="text-[#1DA1F2] text-[20px]" />
                </div>
                <input type="text" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="Username" className="flex-1 h-[44px] px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              </div>
            </div>
            {/* Whatsapp */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Whatsapp</label>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] shrink-0 bg-[#f5f6f8] border border-[#dedee7] flex items-center justify-center rounded-[6px]">
                  <FaWhatsapp className="text-[#25D366] text-[20px]" />
                </div>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="Phone number" className="flex-1 h-[44px] px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              </div>
            </div>
            {/* Youtube */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Youtube</label>
              <div className="flex items-center gap-3">
                <div className="w-[44px] h-[44px] shrink-0 bg-[#f5f6f8] border border-[#dedee7] flex items-center justify-center rounded-[6px]">
                  <FaYoutube className="text-[#FF0000] text-[20px]" />
                </div>
                <input type="text" name="youtube" value={formData.youtube} onChange={handleInputChange} placeholder="Username" className="flex-1 h-[44px] px-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors" />
              </div>
            </div>
          </div>

          <div className="mt-2">
            <button disabled={isSocialLoading} type="submit" className="h-11 px-8 rounded-[6px] bg-[#0a1b56] text-white text-[14px] font-medium transition hover:bg-[#07004d] disabled:opacity-70">
              {isSocialLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications Card */}
        <div className="bg-white rounded-[12px] border border-[#dedee7] shadow-sm p-6 md:p-8">
          <h2 className="text-[20px] font-bold text-[#202127] mb-6">Notifications</h2>
          <form onSubmit={handleNotificationsSubmit} className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="coursePurchases" checked={notificationPreferences.coursePurchases} onChange={handleNotificationChange} className="w-[18px] h-[18px] rounded-[4px] border-[#dedee7] text-[#0a1b56] focus:ring-[#0a1b56] focus:ring-offset-0" />
              <span className="text-[14px] text-[#4e515c]">I want to know who buy my course.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="courseReviews" checked={notificationPreferences.courseReviews} onChange={handleNotificationChange} className="w-[18px] h-[18px] rounded-[4px] border-[#dedee7] text-[#0a1b56] focus:ring-[#0a1b56] focus:ring-offset-0" />
              <span className="text-[14px] text-[#202127] font-medium">I want to know who write a review on my course.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="lectureComments" checked={notificationPreferences.lectureComments} onChange={handleNotificationChange} className="w-[18px] h-[18px] rounded-[4px] border-[#dedee7] text-[#0a1b56] focus:ring-[#0a1b56] focus:ring-offset-0" />
              <span className="text-[14px] text-[#4e515c]">I want to know who commented on my lecture.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="lectureNotesDownloads" checked={notificationPreferences.lectureNotesDownloads} onChange={handleNotificationChange} className="w-[18px] h-[18px] rounded-[4px] border-[#dedee7] text-[#0a1b56] focus:ring-[#0a1b56] focus:ring-offset-0" />
              <span className="text-[14px] text-[#202127] font-medium">I want to know who download my lecture notes.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="commentReplies" checked={notificationPreferences.commentReplies} onChange={handleNotificationChange} className="w-[18px] h-[18px] rounded-[4px] border-[#dedee7] text-[#0a1b56] focus:ring-[#0a1b56] focus:ring-offset-0" />
              <span className="text-[14px] text-[#202127] font-medium">I want to know who replied on my comment.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="dailyProfileVisits" checked={notificationPreferences.dailyProfileVisits} onChange={handleNotificationChange} className="w-[18px] h-[18px] rounded-[4px] border-[#dedee7] text-[#0a1b56] focus:ring-[#0a1b56] focus:ring-offset-0" />
              <span className="text-[14px] text-[#4e515c]">I want to know daily how many people visited my profile.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="lectureFileDownloads" checked={notificationPreferences.lectureFileDownloads} onChange={handleNotificationChange} className="w-[18px] h-[18px] rounded-[4px] border-[#dedee7] text-[#0a1b56] focus:ring-[#0a1b56] focus:ring-offset-0" />
              <span className="text-[14px] text-[#202127] font-medium">I want to know who download my lecture attach file.</span>
            </label>
            <div className="mt-4">
              <button disabled={isNotificationsLoading} type="submit" className="h-11 px-8 rounded-[6px] bg-[#0a1b56] text-white text-[14px] font-medium transition hover:bg-[#07004d] disabled:opacity-70">
                {isNotificationsLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-[12px] border border-[#dedee7] shadow-sm p-6 md:p-8">
          <h2 className="text-[20px] font-bold text-[#202127] mb-6">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5 max-w-[600px]">
            {/* Current Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Current Password</label>
              <div className="flex items-center border border-[#dedee7] rounded-[6px] px-4 bg-white focus-within:border-[#181C7B] transition-colors">
                <input type={showCurrentPassword ? "text" : "password"} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required placeholder="Password" className="flex-1 h-11 bg-transparent text-[14px] outline-none" />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="text-[#a4a5ad] hover:text-[#4e515c] transition-colors">
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">New Password</label>
              <div className="flex items-center border border-[#dedee7] rounded-[6px] px-4 bg-white focus-within:border-[#181C7B] transition-colors">
                <input type={showNewPassword ? "text" : "password"} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required placeholder="Password" className="flex-1 h-11 bg-transparent text-[14px] outline-none" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-[#a4a5ad] hover:text-[#4e515c] transition-colors">
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#4e515c] mb-2">Confirm Password</label>
              <div className="flex items-center border border-[#dedee7] rounded-[6px] px-4 bg-white focus-within:border-[#181C7B] transition-colors">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required placeholder="Confirm new password" className="flex-1 h-11 bg-transparent text-[14px] outline-none" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#a4a5ad] hover:text-[#4e515c] transition-colors">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mt-2">
              <button disabled={isPasswordLoading} type="submit" className="h-11 px-8 rounded-[6px] bg-[#0a1b56] text-white text-[14px] font-medium transition hover:bg-[#07004d] disabled:opacity-70">
                {isPasswordLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Logout */}
            <div className="mt-4">
              <button type="button" onClick={handleLogout} className="flex w-fit items-center gap-2 text-[#ff4b4b] font-medium text-[14px] hover:text-[#be123c] transition-colors">
                <FiLogOut className="text-[18px] rotate-180" /> Logout
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;
