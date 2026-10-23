// Builds the backend seed for Gloxad Academy's 2026 course list from the same catalog file the website uses.
//   node scripts/build-course-seed.mjs
// Output: docs/course-seed/gloxad-courses-seed.json (payloads for POST /admin/categories, POST /tutor/courses,
// PUT /tutor/courses/:id). See docs/course-seed/README.md for how to import it.
import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync(new URL("../src/constants/catalog/gloxadCourses.json", import.meta.url), "utf8"));

const categories = [];
for (const course of catalog.courses) {
  let category = categories.find((c) => c.name === course.category);
  if (!category) {
    category = { name: course.category, order: categories.length + 1, subCategories: [] };
    categories.push(category);
  }
  // Sub-categories are the programme types offered in that category (Academic Programme, Short Course, ...)
  let sub = category.subCategories.find((s) => s.name === course.programme);
  if (!sub) {
    sub = { name: course.programme, topics: [] };
    category.subCategories.push(sub);
  }
  for (const skill of course.skills) if (!sub.topics.includes(skill)) sub.topics.push(skill);
}

const courses = catalog.courses.map((course) => ({
  slug: course.slug,
  // Prices for short courses, bootcamps and monthly programmes aren't set in the 2026 framework yet
  needsPrice: course.price === null,
  note: course.videoNote ?? null,
  create: {
    title: course.title,
    subtitle: course.subtitle,
    category: course.category,
    subCategory: course.programme,
    topic: course.skills[0],
    language: "English",
    level: "beginner",
    courseType: "paid",
    price: course.price,
  },
  update: {
    thumbnail: course.thumbnail,
    trailerVideoUrl: course.videos[0].url,
    description: course.description,
    skills: course.skills,
    targetAudience: ["Beginners", "Career changers", "Students and graduates"],
    requirements: course.entry ? [course.entry] : ["A computer or smartphone with internet access"],
    modules: course.videos.map((video, index) => ({
      title: `Module ${index + 1}: ${video.title}`,
      lessons: [{ title: video.title, duration: video.length, isFreePreview: index === 0, videoUrl: video.url }],
      quizzes: [],
    })),
    welcomeMessage: `Welcome to ${course.title} at Gloxad Academy! The video lessons are by freeCodeCamp.org, used with permission.`,
    congratsMessage: `Congratulations on completing ${course.title}!`,
  },
}));

const seed = { source: catalog.source, videoCredit: catalog.videoCredit, generatedFrom: "src/constants/catalog/gloxadCourses.json", categories, courses };
writeFileSync(new URL("../docs/course-seed/gloxad-courses-seed.json", import.meta.url), JSON.stringify(seed, null, 2) + "\n");
console.log(`${categories.length} categories, ${courses.length} courses (${courses.filter((c) => c.needsPrice).length} need a price)`);
