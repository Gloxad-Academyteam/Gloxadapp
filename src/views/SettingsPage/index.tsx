"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  FaUpload, FaEye, FaEyeSlash, FaChevronDown, 
  FaGlobe, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaWhatsapp, FaYoutube 
} from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { useS3Upload } from "@hooks/useS3Upload";
import { useQueryClient } from "@tanstack/react-query";
import { updatePassword, updateProfile } from "@services/auth";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const SettingsPage = () => {
  const { authenticatedUser, handleLogout, isLoggingOut } = useAuth();
  const { uploadFile, isUploading: isUploadingAvatar, uploadProgress } = useS3Upload();
  const queryClient = useQueryClient();
  const user: any = authenticatedUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);

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

  useEffect(() => setAvatarImageFailed(false), [formData.avatarUrl]);

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
      const savedProfile = await updateProfile({ avatarUrl: url });
      const savedAvatar = savedProfile.data?.avatarUrl || savedProfile.data?.avatar || url;
      setFormData((prev) => ({ ...prev, avatarUrl: savedAvatar }));
      if (savedProfile.data) {
        queryClient.setQueryData(["auth.me"], {
          ...savedProfile,
          data: { ...savedProfile.data, avatar: savedAvatar, avatarUrl: savedAvatar },
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["auth.me"] });
      toast.success("Profile photo updated");
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
          <div className="mb-6">
            <h2 className="text-[20px] font-bold text-[#202127]">Profile information</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[#717480]">Update the details people see when they learn with you.</p>
          </div>
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
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Your role or professional title" className="flex-1 h-11 bg-transparent text-[14px] outline-none" />
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
              <textarea name="biography" value={formData.biography} onChange={handleInputChange} placeholder="Share a little about your background, interests, and goals." className="w-full h-[120px] p-4 rounded-[6px] border border-[#dedee7] bg-white text-[14px] outline-none focus:border-[#181C7B] transition-colors resize-none"></textarea>
            </div>

            <div className="mt-2">
              <button disabled={isLoading} type="submit" className="h-11 px-8 rounded-[6px] bg-[#0a1b56] text-white text-[14px] font-medium transition hover:bg-[#07004d] disabled:opacity-70">
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Profile photo */}
        <aside className="order-1 w-full shrink-0 md:order-2 md:w-[280px]">
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-[10px] border border-[#e5e7ef] bg-[#fafbff] px-6 py-8 text-center">
            <div className={`flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e9edff] text-[#24327d] shadow-sm ring-1 ring-[#dfe3f2] transition ${isUploadingAvatar ? "ring-4 ring-[#b8c4ff]" : ""}`}>
              {formData.avatarUrl && !avatarImageFailed ? (
                <img
                  src={formData.avatarUrl}
                  alt={`${formData.firstName || "Your"} profile photo`}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarImageFailed(true)}
                />
              ) : (
                <span className="text-[28px] font-bold" aria-hidden="true">
                  {formData.firstName[0]?.toUpperCase() || formData.lastName[0]?.toUpperCase() || <FiUser size={30} />}
                  {formData.firstName[0] && formData.lastName[0] ? formData.lastName[0].toUpperCase() : ""}
                </span>
              )}
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-[#202127]">Profile photo</h3>
            <p className="mt-1 max-w-[220px] text-[12px] leading-relaxed text-[#717480]">This photo appears on your account and course activity.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="mt-5 inline-flex h-[40px] items-center justify-center gap-2 rounded-full border border-[#d8dced] bg-white px-5 text-[13px] font-semibold text-[#202127] transition hover:border-[#aeb8ec] hover:bg-[#f4f6ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#dbe2ff] disabled:cursor-wait disabled:opacity-60"
            >
              <FaUpload aria-hidden />
              {isUploadingAvatar ? `Uploading ${uploadProgress}%` : formData.avatarUrl ? "Change photo" : "Upload photo"}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploadingAvatar} aria-label="Upload a profile photo" />
            {isUploadingAvatar ? (
              <div className="mt-3 w-full max-w-[180px]">
                <div className="h-1.5 overflow-hidden rounded-full bg-[#e7e9f3]" role="progressbar" aria-label="Photo upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress}>
                  <div className="h-full rounded-full bg-[#4258d6] transition-[width]" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-[#85899a]">PNG, JPG or WEBP. Up to 5MB.</p>
            )}
          </div>
        </aside>
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
            <div className="mt-3 border-t border-[#eef0f6] pt-5">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full max-w-[320px] items-center gap-3 rounded-xl border border-[#f0d8d6] bg-white px-3 py-3 text-left transition hover:border-[#e8b8b5] hover:bg-[#fff9f8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5e2] disabled:cursor-wait disabled:opacity-60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff0ef] text-[#b93832]">
                  <FiLogOut size={18} aria-hidden />
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#a8342e]">{isLoggingOut ? "Logging out..." : "Log out"}</span>
                  <span className="mt-0.5 text-[11px] text-[#777c8e]">Sign out of your Gloxad account</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;
