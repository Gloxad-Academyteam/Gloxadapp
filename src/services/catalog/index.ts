import catalogData from "@constants/catalog/gloxadCourses.json";

// Gloxad Academy's 2026 course list (constants/catalog/gloxadCourses.json), shown on the site until
// the courses exist in the database. Lessons are freeCodeCamp.org videos, used with permission.
// Regenerate the backend seed from the same file with `node scripts/build-course-seed.mjs`.

export type TCatalogVideo = {
  youtubeId: string;
  title: string;
  length: string;
  duration: string;
  url: string;
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
  modules: {
    title: string;
    duration: string;
    lessons: { title: string; duration: string; videoUrl: string; youtubeId: string; isFreePreview: true }[];
  }[];
};

export const CATALOG_VIDEO_CREDIT: string = catalogData.videoCredit;

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
  // One module per video lesson
  modules: entry.videos.map((video) => ({
    title: video.title,
    duration: video.duration,
    lessons: [
      { title: video.title, duration: video.duration, videoUrl: video.url, youtubeId: video.youtubeId, isFreePreview: true },
    ],
  })),
});

export const catalogCourses: TCatalogCourse[] = (catalogData.courses as TCatalogEntry[]).map(toCourse);

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

const normalise = (value: string) => value.toLowerCase().replace(/[-_]+/g, " ").trim();

// `category` accepts a name ("Data Science & Analytics") or its slug ("data-science-and-analytics")
export function searchCatalog({ search, category }: { search?: string | null; category?: string | null }) {
  const query = search ? normalise(search) : "";
  const categoryKey = category ? categorySlug(category) : "";

  return catalogCourses.filter((course) => {
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

