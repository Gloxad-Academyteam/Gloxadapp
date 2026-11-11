# Live API documentation vs the Backend Technical Specification (v1.1)

Checked 11 November 2026.

- **Documentation checked:** the page served at https://gloxard-backend.onrender.com/ (last modified 11 Nov 2026, 09:16 UTC). It is an HTML page, not a .docx.
- **Specification:** "Gloxad LMS Backend Technical Specification Ver 1" (the PDF given to the backend team).
- **Method:** I read the documentation page, counted the endpoints it documents, and sent read-only requests to the live server to confirm the documented LMS routes exist. A 401 means the route exists and is guarded.

## What the documentation covers well

| Spec area | In the docs |
|---|---|
| Roles and permissions (spec 13) | Every endpoint names who may call it (public, enrolled, instructor, admin, cohort guard). |
| Trimester LMS core | `GET /api/lms/me`, dashboard, `GET /api/lms/cohorts/:cohortId/curriculum` (the exact path the spec suggests), lessons, lesson progress, comments, quizzes with attempts and answers. |
| Assignments and grading basics | `GET/POST` assignments and submissions, a rubric with criteria and points, `PUT /api/lms/submissions/:id/grade`, an instructor grading queue, a late flag. |
| Live classes (spec Q6) | LiveKit: session scheduling, a `join` that returns a LiveKit token and server URL with host and viewer roles, chat, polls, votes. |
| Attendance (spec Q6) | Roster with status, joined time and minutes, plus a manual override (present, absent, excused). |
| Certificates | Verifiable PDF with a QR code, public verification, revoke and reissue by admin, a recent-certificates audit list. |
| Community and analytics | Channels, posts, replies, reports; instructor and admin analytics. |
| Everything above exists on the live server | Probes of the documented LMS routes returned 401 (present, guarded). |

## Gaps: in the specification but not in the documentation

| Spec requirement | Status in the docs | Detail |
|---|---|---|
| Q1: 18 dynamic categories, subcategories, tags, legacy aliases, deactivate | Partial | Category CRUD exists, but the 18 are not shown, there are no tags or aliases, and the admin call is `DELETE`, where the spec says deactivate without breaking history. |
| Q2: providers and attribution (creator, platform, URL, ownership class, per-lesson credit) | Missing | The word "provider" appears only as `livekit`. There is no provider entity or attribution fields. |
| Q3: 22-node trail (nodeIndex 1-22, phase, completion criteria, week 11 and 12 structure) | Partial | The curriculum endpoint returns weekly modules with lessons, a quiz and an assignment. It has no node index, no 22 nodes, no phases and no per-node completion state. |
| Q4: eight-stage final project with tutor review and administrator approval | Missing | No final project, stage, topic approval or administrator sign-off endpoints. |
| Q4/Q5: grading engine with weights, raw versus weighted marks, late and resubmission caps, gradebooks | Missing | Only per-assignment rubric points. There are no categories, no weights, no gradebook endpoint and no cap policy. |
| Q5: default weights 15/15/15/10/10/10/25 and a 70% certificate threshold | Missing | "70%" appears only as the 70/30 instructor revenue share in the payment webhook. Certificate eligibility rules are not described. |
| Q6: automatic recording with processing, available and failed states, replay access | Missing | The only recording field is a manually supplied `recordingUrl`. No Egress, no lifecycle states, no replay endpoint. Attendance versus replay separation is not described. |
| Q6: YouTube Live as the secondary option | Missing | Not mentioned. |
| Q7: persistent workspace with cloud autosave, versions and recovery | Missing | "Workspace" in the docs means the institution workspace. There is no autosave endpoint. |
| Q7: GitHub connect, push, pull, commit-based submission | Missing | GitHub appears only as a social link on a profile. |
| Q7: server-side code execution | Missing | Not documented. |
| Audit history for grade changes, approvals and policy changes (spec 12.1) | Missing | Audit appears only on certificate revocation. |
| Notifications and error codes per endpoint | Partial | General HTTP codes are listed. The spec asks for per-endpoint error codes and event contracts. |

## Mismatches inside the documentation itself

- The introduction says the portal documents "51 REST API endpoints and 8 Socket.io events", but the page documents about 95 endpoints in its reference sections and 45 in the LMS sections. The count is out of date.
- Category removal is `DELETE`; the spec says deactivate and keep history.
- Where `70%` appears it is the revenue share, not the certificate threshold, so it could be mistaken for the spec's rule.

## Not in the documentation yet (work done in this project)

These exist in the local backend repository but are uncommitted or undeployed, so they return 404 on the live server and are not documented:

- `GET /api/lms/public/trimesters`, `GET /api/lms/public/trimesters/:id`, `POST /api/lms/trimesters/:id/enrol`
- Scholarships: public list, apply, admin create and review
- Module-by-module free courses: `GET /api/learning/:courseId/modules` and the module task endpoints
