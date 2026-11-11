import catalogData from "@constants/catalog/gloxadCourses.json";
import { formatLength } from "@utils/youtube";
import { getYouTubeSourceName, isCourseVisible, isFreeYouTubeCourse } from "@utils/courseSource";

// Gloxad Academy's 2026 course list (constants/catalog/gloxadCourses.json), shown on the site until
// the courses exist in the database. Lessons are YouTube videos from their original creators (freeCodeCamp.org
// for most courses, others for the rest), each credited on its course; they play in YouTube's official player.
// Regenerate the backend seed from the same file with `node scripts/build-course-seed.mjs`.

// A chapter the video's creator published on YouTube: where it starts and ends, in seconds
export type TCatalogChapter = { title: string; start: number; end: number };

export type TCatalogVideo = {
  youtubeId: string;
  title: string;
  length: string;
  duration: string;
  url: string;
  chapters?: TCatalogChapter[];
};

export type TPathwayStage = { stage: string; duration: string; fee: number; note: string };

type TCatalogEntry = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  type: "academic" | "foundation" | "short" | "business" | "prep";
  programme: string;
  level: string;
  price: number | null;
  priceLabel: string;
  duration: string;
  entry?: string;
  skills: string[];
  whatYouWillLearn: string[];
  pathway?: TPathwayStage[];
  videos: TCatalogVideo[];
  videoHours: number;
  videoNote?: string;
  // Who made the videos, e.g. "Video lessons by CS50 (youtube.com/@cs50), ...". Falls back to the catalogue-wide credit.
  videoCredit?: string;
  thumbnail: string;
};

// Same field names the API uses for courses, so the existing cards and course page render it unchanged
export type TCatalogCourse = TCatalogEntry & {
  _id: string;
  isCatalog: true;
  courseType: "free" | "paid";
  thumbnailUrl: string;
  trailerVideoUrl: string;
  whatYouWillTeach: string[];
  aboutCourseText: string;
  instructor: { firstName: string; lastName: string; avatarUrl: string };
  sourceName: string;
  videoCredit: string;
  modules: {
    title: string;
    duration: string;
    lessons: {
      _id: string;
      title: string;
      duration: string;
      videoUrl: string;
      youtubeId: string;
      startSeconds: number;
      endSeconds: number;
      isFreePreview: true;
    }[];
  }[];
};

export const CATALOG_VIDEO_CREDIT: string = catalogData.videoCredit;

// Shown under course lists: each course names its own provider, so there is no single credit line
export const CATALOG_PROVIDER_NOTE = "Lessons come from their original creators and play through YouTube's official player. Each course names its provider.";

const lengthToSeconds = (length: string) => length.split(":").map(Number).reduce((total, part) => total * 60 + part, 0);

// Chapters of each video, keyed by YouTube id. They live in their own file (src/constants/catalog/gloxadChapters.json)
// and are loaded only on course pages, so the course lists stay small.
export type TChaptersByVideo = Record<string, TCatalogChapter[]>;

// The video's chapters, or the whole video as one chapter when it has none
const chaptersOf = (video: TCatalogVideo, byVideo: TChaptersByVideo): TCatalogChapter[] => {
  const chapters = byVideo[video.youtubeId] ?? video.chapters;
  return chapters?.length ? chapters : [{ title: video.title, start: 0, end: lengthToSeconds(video.length) }];
};

const buildModules = (entry: TCatalogEntry, byVideo: TChaptersByVideo): TCatalogCourse["modules"] =>
  // One module per video, and one lesson per chapter of that video
  entry.videos.map((video) => ({
    title: video.title,
    duration: video.duration,
    lessons: chaptersOf(video, byVideo).map((chapter) => ({
      _id: `catalog-${entry.slug}-${video.youtubeId}-${chapter.start}`,
      title: chapter.title,
      duration: formatLength(chapter.end - chapter.start),
      videoUrl: `${video.url}&t=${chapter.start}s`,
      youtubeId: video.youtubeId,
      startSeconds: chapter.start,
      endSeconds: chapter.end,
      isFreePreview: true as const,
    })),
  }));

const toCourse = (entry: TCatalogEntry): TCatalogCourse => ({
  ...entry,
  _id: `catalog-${entry.slug}`,
  isCatalog: true,
  // Price 0 means free, the same rule the backend uses when it imports the catalog
  courseType: entry.price === 0 ? "free" : "paid",
  thumbnailUrl: entry.thumbnail,
  trailerVideoUrl: entry.videos[0]?.url ?? "",
  whatYouWillTeach: entry.whatYouWillLearn,
  aboutCourseText: entry.description,
  // No avatarUrl: the course page falls back to an initials avatar
  instructor: { firstName: "Gloxad", lastName: "Academy", avatarUrl: "" },
  sourceName: getYouTubeSourceName({ videoCredit: entry.videoCredit ?? CATALOG_VIDEO_CREDIT }),
  videoCredit: entry.videoCredit ?? CATALOG_VIDEO_CREDIT,
  // Without the chapters file each video is one lesson; withChapters() upgrades a course once it has loaded
  modules: buildModules(entry, {}),
});

export const catalogCourses: TCatalogCourse[] = (catalogData.courses as TCatalogEntry[]).map(toCourse);
export const visibleCatalogCourses = catalogCourses.filter(isCourseVisible);
export const youtubeFreeCatalogCourses = catalogCourses.filter(isFreeYouTubeCourse);

// Picks up to `count` courses taking one provider at a time, so a short list shows several providers instead of one
export const pickDiverse = <T extends { sourceName: string }>(courses: T[], count: number): T[] => {
  const byProvider = new Map<string, T[]>();
  courses.forEach((course) => byProvider.set(course.sourceName, [...(byProvider.get(course.sourceName) ?? []), course]));
  const queues = [...byProvider.values()];
  const picked: T[] = [];
  for (let round = 0; picked.length < count && queues.some((queue) => queue[round]); round++) {
    for (const queue of queues) if (queue[round] && picked.length < count) picked.push(queue[round]);
  }
  return picked;
};

// Categories in the order the home page tabs show them
export const CATALOG_CATEGORIES = [
  "Software Development",
  "Design",
  "Data Science & Analytics",
  "Artificial Intelligence",
  "Cloud & Cybersecurity",
  "Marketing & Sales",
  "Business & Entrepreneurship",
  "Blockchain",
  "Foundations",
  "Test Preparation",
] as const;

export const categorySlug = (category: string) =>
  category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const findCatalogCourse = (slug: string) => catalogCourses.find((course) => course.slug === slug) ?? null;

let chaptersPromise: Promise<TChaptersByVideo> | null = null;

// Loads the chapters file the first time a course page asks for it
export const loadCatalogChapters = (): Promise<TChaptersByVideo> => {
  if (!chaptersPromise) {
    chaptersPromise = import("@constants/catalog/gloxadChapters.json").then((module) => module.default as TChaptersByVideo);
  }
  return chaptersPromise;
};

// The same course with its modules rebuilt from the video chapters
export const withChapters = (course: TCatalogCourse, byVideo: TChaptersByVideo): TCatalogCourse => {
  const entry = (catalogData.courses as TCatalogEntry[]).find((item) => item.slug === course.slug);
  return entry ? { ...course, modules: buildModules(entry, byVideo) } : course;
};

const normalise = (value: string) => value.toLowerCase().replace(/[-_]+/g, " ").trim();

// `category` accepts a name ("Data Science & Analytics") or its slug ("data-science-and-analytics")
export function searchCatalog({ search, category }: { search?: string | null; category?: string | null }) {
  const query = search ? normalise(search) : "";
  const categoryKey = category ? categorySlug(category) : "";

  return visibleCatalogCourses.filter((course) => {
    if (categoryKey && categorySlug(course.category) !== categoryKey) return false;
    if (!query) return true;
    const haystack = normalise(
      [course.title, course.subtitle, course.description, course.category, course.programme, ...course.skills].join(" "),
    );
    return query.split(/\s+/).every((word) => haystack.includes(word));
  });
}

/**
 * Database courses imported from this catalog (backend: npm run catalog:import) name a few fields differently.
 * Maps them to the catalog shape so the course page treats both the same.
 */
export function normaliseApiCourse(course: any) {
  if (!course) return course;
  return {
    ...course,
    entry: course.entry ?? (course.entryRequirement || undefined),
    duration: course.durationLabel || course.duration,
    thumbnailUrl: course.thumbnailUrl ?? course.thumbnail,
    whatYouWillTeach: course.whatYouWillTeach ?? findCatalogCourse(course.slug)?.whatYouWillTeach,
  };
}

// Listed but not purchasable yet: catalog-only courses, and imported courses whose price isn't set
// Free catalog courses can be enrolled in (once they are in the database); paid ones are closed until priced
export const isEnrollmentClosed = (course: any) =>
  course?.enrollmentOpen === false || (!!course?.isCatalog && course?.courseType !== "free");

