# Gloxad Academy course seed (2026)

`gloxad-courses-seed.json` holds every course from *Gloxad Academy Complete Course List 2026* in the shape the backend API expects, so the courses can be created as real, enrollable courses. The website already shows them from `src/constants/catalog/gloxadCourses.json` until they exist in the database. Once a course is in the database, the site shows the database version instead of the catalog copy, matched by title.

Video lessons are freeCodeCamp.org YouTube videos, used with permission. Every video ID was checked against YouTube's oEmbed endpoint and confirmed as a freeCodeCamp.org upload.

## Contents

| Field | What it is |
| --- | --- |
| `categories` | 10 categories for `POST /api/admin/categories`. Each sub-category is a programme type (Academic Programme, Short Course, Bootcamp, ...) with its skills as topics. |
| `courses[].create` | Body for `POST /api/tutor/courses` (step 1: creates the draft). |
| `courses[].update` | Body for `PUT /api/tutor/courses/:id` (steps 2 to 4: thumbnail, description, modules and lessons, welcome and congratulations messages). |
| `courses[].needsPrice` | `true` when the 2026 framework sets no price yet. Set `create.price` before importing. |
| `courses[].note` | Content gaps to fix before launch (IELTS and GRE). |

## Import order

1. As an admin: create each entry in `categories` with `POST /api/admin/categories`.
2. As the instructor account that should own the courses, for each course:
   1. `POST /api/tutor/courses` with `create` and keep the returned `course._id`.
   2. `PUT /api/tutor/courses/:id` with `update`.
   3. `POST /api/tutor/courses/:id/submit`.
3. As an admin: approve each course with `PUT /api/admin/courses/:id/status` and `{ "status": "published" }`.

## Before importing

- **Prices:** 24 courses (short courses, bootcamps, monthly and preparatory programmes) have `price: null`. The source document says these prices aren't established yet.
- **Academic programmes** are seeded once each at the Certificate stage (₦150,000). The Professional Certificate (₦300,000) and Diploma (₦400,000) stages are listed in the website's pathway table, not as separate courses.
- **Founder Academy: Startup & Small Business Launch** isn't included. The source document asks to confirm whether it's the same as Startup Founder Academy.
- **IELTS Preparation** has only a general language-learning video, because freeCodeCamp has no IELTS course. **GRE Preparation** covers the quantitative section only.

## Regenerating

Edit `src/constants/catalog/gloxadCourses.json`, then run:

```bash
node scripts/build-course-seed.mjs
```
