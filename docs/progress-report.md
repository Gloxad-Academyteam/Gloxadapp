# Gloxad Academy: progress report

Prepared 2 November 2026. Covers the web app (`Gloxadapp`) and the backend (`gloxard-backend`).

## 1. Summary

- The learner side of the course platform is rebuilt to the Figma designs and works end to end on real data: course page and player, quiz and results, completion, certificates (with public verification), learner home and My Courses.
- The site is installable as an app (PWA) and the new screens are responsive down to phone width.
- This week's assignment (Trimester Program and LMS landing pages) is started. Two of the four landing pages and their backend are done and tested. Assignments, the Progress screen and the instructor and admin tools are not built yet.
- Not yet live: the Vercel and Render deployments have not been updated since 27 October, so none of this is visible on the public site.

## 2. Done and verified

### Course learning experience (committed and pushed, commit dd668af)

| Area | What it does |
|---|---|
| Course page and player | Left menu with modules and tick marks, previous/next, progress, Full screen button, Mark as complete. YouTube's own controls are kept. Tabs: Transcript, Notes, Course Materials, Review. |
| Quiz and results | All questions on one page, Submit stays disabled until every question is answered, then a score ring and per-question results with Retake and Next Module. |
| Completion and certificates | Congratulations page, certificate page with PDF download, certificates list, and a public verify page (`/verify/<id>`) that says whether a certificate is genuine. |
| Learner home and My Courses | Welcome banner, Continue Learning, recommendations, overall progress; In Progress / Completed / Certificates tabs. All figures come from real data. |
| Header | Profile menu: Profile, Basic Information, Change Password, Log Out. |
| Free courses | 74 free courses; "Our Courses" is hidden until a tutor has published a course. |
| App install (PWA) | Manifest, icons, offline page and service worker (production only). |
| Responsiveness | No sideways scroll at 375 px on the player, quiz, certificate, completed, dashboard, My Courses and verify pages. |

### Course cards (done, not yet committed)

One shared, clean card (Udemy/Coursera style) on the home page, Free Courses, Our Courses and the dashboard Free tab. Three columns on desktop, wide image, title, provider, facts, price. The heavy hover lift and shadow were removed.

### Trimester Program and landing pages (this week, not yet committed)

| Item | State |
|---|---|
| Shared landing framework (`src/components/Landing`) | Done: header, loading, empty, error states, shared date format. |
| `/trimester` | Done. Published programmes only, four week journey, button by viewer state (Sign in to enrol, Enrol now, Continue learning, Opens on, Closed, Only students can enrol). The earlier "Not available" gate was removed everywhere. |
| `/scholarships` | Done. Published only, upcoming/open/closed, apply form, application status with the reviewer's latest note. |
| Backend | `Scholarship` and `ScholarshipApplication` models; public trimester and scholarship lists; enrol; apply; admin create, edit, publish, archive and review; trimester status update. |

## 3. Test results (2 November, local)

Browser, desktop and phone:

- Signed out: Trimester shows Sign in to enrol and four weeks; Scholarships shows Sign in to apply and Opens on.
- Student (Alice): Enrol now leads to the LMS dashboard; the page then shows Continue learning; applying shows "Submitted".
- No horizontal overflow at 375 px.

Server rules:

| Check | Expected | Result |
|---|---|---|
| Enrol twice | 409 | Pass |
| Instructor enrols | 403 | Pass |
| Signed out enrols | 401 | Pass |
| Apply before the window opens | 409 | Pass |
| Student or tutor calls an admin route | 403 | Pass |
| Invalid scholarship id | 400 | Pass |
| Draft trimester or scholarship on the public page | Hidden | Pass |
| Application history | Appended, never rewritten | Pass |
| Duplicate application | 409 | Pass |
| Closed window | 409 | Pass |

Bugs found and fixed during testing: editing a scholarship without resending its lists wiped them; dates showed a day early in some timezones.

`tsc` is clean and the production build passes.

## 4. Not done yet (from the Weekly Developer Guide)

- Lesson page on real data: YouTube 90% watched rule, sandbox autosave, assignment and discussion blocks.
- Assignments with submission, rubric, grading and feedback (no backend models yet).
- Progress and Final Project screen and configurable completion weights.
- Server check of the Join Live Class 10 minute window, and live attendance feeding Progress.
- Discussions, notifications, program certificates.
- Instructor tools: roster, attendance, grading, feedback, announcements.
- Admin tools: program setup, enrolment, scheduling, scholarship review screens, certificates, reports. (The scholarship APIs exist, the screens do not.)
- Scholarship document upload; paid trimester checkout (a paid trimester refuses enrolment for now).
- Day 1 guide items: route list, API list, role matrix, status transition rules, known issues, next phase backlog (the audit is in `docs/lms-audit.md`).

## 5. Needed from the team

1. The Trimester Dev Spec HTML (the five student screens) and, if possible, the 16 page PRD.
2. Product decisions: enrolment and payment, completion rules, certificate issue rules, scholarship fields.
3. Designs, or agreement to reuse the student style, for instructor and admin screens.
4. The new GitHub organisation URL, so the remote can be repointed and pushed.
5. Vercel and Render: reconnect to the repositories, redeploy, and run `npm run catalog:import` on Render. Open question: is the Vercel plan Hobby or Pro?

## 6. Risks and follow-ups

- The quiz API does not return the correct answer, so the results screen cannot show "Correct answer". The backend needs `correctOptionIndex` in the quiz submit breakdown.
- Transcript, course materials, AI Tutor, weekly goals and discussions have no backend data yet.
- The seed password is in a public repository.
- The YouTube player terms need technical lead review.
- Course cards and this week's work are uncommitted in both repositories.
