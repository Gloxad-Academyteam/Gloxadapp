type TUser = {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar: string;
  avatarUrl?: string;
  role?: string;
  isEmailVerified?: boolean;
  biography?: string;
  approvalStatus?: string;
  certifications?: string[];
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
    youtube?: string;
  };
  notificationPreferences?: {
    coursePurchases?: boolean;
    courseReviews?: boolean;
    lectureComments?: boolean;
    lectureNotesDownloads?: boolean;
    commentReplies?: boolean;
    dailyProfileVisits?: boolean;
    lectureFileDownloads?: boolean;
  };
};

export type { TUser };
