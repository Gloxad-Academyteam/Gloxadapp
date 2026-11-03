# LMS audit: existing vs missing (Day 1)

Source: Gloxad LMS Weekly Developer Guide, 2 November 2026. Checked against the frontend `src/views/Lms`, `src/app` and the backend `src/models/Lms.model.js`, `src/routes/lms.routes.js`.

## Public landing pages

| Page | Route | State |
|---|---|---|
| LMS home | `/lms` | Role router: shows a student, instructor or admin dashboard. No public landing page for visitors. |
| Courses | `/courses` | Built (catalogue and tutor courses). |
| Trimester | `/trimester` | DONE (2 Nov). Lists published programmes, four week journey, Enrol / Continue / Sign in / closed / opens-on states, loading, empty and error states. |
| Scholarships | `/scholarships` | DONE (2 Nov). Published only, upcoming/open/closed, apply form, application status with the latest note. Backend: models, public list, apply, admin create/publish/review. |
| Other sections | live, materials, community, projects, certificates, help | Student screens exist, no public landing. |

## Student screens (`/lms/*`)

| Screen | Live API | Notes |
|---|---|---|
| Dashboard (`StudentDashboard`) | Yes | Needs 22-node trail, Continue Learning from `last_activity`, announcements, quick access check. |
| Week view (`WeeklyPathPage`) | Yes | Check it uses one DayCard and the locked/in progress/completed states. |
| Lesson (`LessonPage`) | No, sample data | Needs YouTube IFrame events, 90% watched rule, sandbox autosave, assignment and discussion blocks. |
| Live class (`LiveClassPage`) | Yes | Needs the server check of the 10 minute join window, and attendance feeding Progress. |
| Progress and final project | No screen | Completion ring, breakdown bars, weights table and 8 stage stepper are missing. |
| Quiz (`QuizPage`) | No, sample data | Correct answers must show only after an attempt. |
| Assignments (`AssignmentsPage`) | No, sample data | No backend models. |
| Community (`CommunityPage`) | No, sample data | Only announcements exist in the backend. |
| Certificates (`CertificatesPage`) | No, sample data | Program certificate logic missing. |
| Coding lab, help | Yes | Done. |

## Instructor and admin

Both dashboards (`InstructorDashboard`, `AdminDashboard`) use sample data. No program setup, roster, attendance, grading, feedback, enrolment, scheduling, scholarship review, certificate issue or reports.

## Backend

Present: Trimester, Cohort, Week, Day, Progress, Announcement, Inquiry, LiveSession, LiveMessage, LiveAttendance, Poll, CodeLab, CodeSubmission.

Missing: Scholarship and ScholarshipApplication, Assignment, Submission, Rubric, Grade and Feedback, Discussion and Reply, Quiz and QuizAttempt for the trimester, Project and ProjectSubmission, program Certificate, Notification triggers, completion weights table, publish status (Draft, Published, Archived), reports endpoints, audit history for grades and decisions.

## Rule gaps (from the twelve rules)

- Rule 2/10: nothing is admin editable yet, so drafts and page content cannot be managed.
- Rule 5: completion comes from `/lms/progress` only, with no per-program rules.
- Rule 7: no audit history for grades or certificates.
- Rule 8: the join window is not confirmed on the server.
- Rule 9: several buttons run on sample data.

## Open decisions (product owner)

Landing page inventory, enrolment policy, scholarship policy, completion rules, certificate rules, technical constraints. Build these as settings where possible.

## Progress log

- 2 Nov: shared landing framework (`src/components/Landing`), Trimester page, Scholarships page, backend `Scholarship.model.js`, `lmsPublic.controller.js`, `lmsScholarshipAdmin.controller.js`. Tested: drafts hidden, closed window blocked, duplicate application blocked (409), instructors cannot enrol (403), anonymous enrol (401), history is appended not rewritten.
- Trimester enrolment is free-only for now: a paid trimester returns 402 until checkout is connected (enrolment policy is still an open product decision).
