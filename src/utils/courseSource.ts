type TVideoSourceEntry = {
  youtubeId?: string | null;
  videoUrl?: string | null;
  url?: string | null;
};

type TCourseSourceCandidate = {
  courseType?: string | null;
  price?: number | string | null;
  isCatalog?: boolean;
  videoSource?: string | null;
  videoCredit?: string | null;
  sourceName?: string | null;
  creatorName?: string | null;
  youtubeChannelName?: string | null;
  youtubeChannelUrl?: string | null;
  // The API's own attribution: `source` carries the platform and creator, `provider` links the shared provider record
  source?: { platform?: string | null; creatorName?: string | null; channelUrl?: string | null; url?: string | null } | null;
  provider?: { name?: string | null; channelUrl?: string | null; platform?: string | null } | string | null;
  lessons?: TVideoSourceEntry[] | null;
  videos?: TVideoSourceEntry[] | null;
  modules?: { lessons?: TVideoSourceEntry[] | null }[] | null;
};

const isYouTubeUrl = (value?: string | null) => {
  if (!value) return false;
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host === "youtu.be" || host.endsWith(".youtube.com") || host === "youtube.com" || host.endsWith(".youtube-nocookie.com");
  } catch {
    return /(?:youtube\.com|youtu\.be)/i.test(value);
  }
};

export const isFreeCourse = (course: TCourseSourceCandidate) => {
  const courseType = course?.courseType?.trim().toLowerCase();
  if (courseType) return courseType === "free";
  return course?.price !== null && course?.price !== undefined && Number(course.price) === 0;
};

export const isYouTubeCourse = (course: TCourseSourceCandidate) => {
  if (!course) return false;
  const entries = [
    ...(course.modules ?? []).flatMap((module) => module.lessons ?? []),
    ...(course.lessons ?? []),
    ...(course.videos ?? []),
  ];
  const videoEntries = entries.filter((entry) => entry.youtubeId || entry.videoUrl || entry.url);
  if (videoEntries.length) {
    return videoEntries.every((entry) => Boolean(entry.youtubeId) || isYouTubeUrl(entry.videoUrl || entry.url));
  }
  return (
    course.videoSource?.trim().toLowerCase() === "youtube" ||
    course.source?.platform?.trim().toLowerCase() === "youtube" ||
    /youtube/i.test(course.videoCredit ?? "")
  );
};

export const isFreeYouTubeCourse = (course: TCourseSourceCandidate) =>
  isFreeCourse(course) && isYouTubeCourse(course);

// Paid courses remain in the general catalogue. Free courses need verifiable YouTube content.
export const isCourseVisible = (course: TCourseSourceCandidate) =>
  !isFreeCourse(course) || isFreeYouTubeCourse(course);

export const getYouTubeSourceName = (course: TCourseSourceCandidate) => {
  const provider = typeof course.provider === "object" ? course.provider : null;
  const suppliedName = provider?.name || course.source?.creatorName || course.youtubeChannelName || course.sourceName || course.creatorName || "";
  const credit = course.videoCredit || "";
  if (/freecodecamp/i.test(`${suppliedName} ${credit}`)) return "freeCodeCamp.org";
  if (suppliedName.trim()) return suppliedName.trim();
  const match = credit.match(/(?:videos?|lessons?)\s+(?:by|from)\s+([^;(,.]+)/i);
  return match?.[1]?.trim() || "YouTube creator";
};

export const getYouTubeSourceUrl = (course: TCourseSourceCandidate) => {
  const provider = typeof course.provider === "object" ? course.provider : null;
  if (isYouTubeUrl(provider?.channelUrl)) return provider!.channelUrl!;
  if (isYouTubeUrl(course.source?.channelUrl)) return course.source!.channelUrl!;
  if (isYouTubeUrl(course.youtubeChannelUrl)) return course.youtubeChannelUrl!;
  const credit = course.videoCredit || "";
  if (/freecodecamp/i.test(credit)) return "https://www.youtube.com/@freecodecamp";
  const match = credit.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/[^)\s,;]+|youtu\.be\/[^)\s,;]+)/i);
  if (!match) return "https://www.youtube.com/";
  const url = match[0];
  return url.startsWith("http") ? url : `https://${url.replace(/^www\./i, "")}`;
};

// A course's category is a name in older data and a { _id, name, slug } object in the current API
export const getCategoryName = (category: unknown): string => {
  if (typeof category === "string") return category;
  if (category && typeof category === "object" && typeof (category as { name?: unknown }).name === "string") return (category as { name: string }).name;
  return "";
};
