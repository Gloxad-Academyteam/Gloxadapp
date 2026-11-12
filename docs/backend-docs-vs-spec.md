# Live API documentation vs the Backend Technical Specification (v1.1)

Checked 11 November 2026 and updated 12 November 2026.

- **Documentation checked:** the page served at https://gloxard-backend.onrender.com/ (last modified 12 Nov 2026, 07:07 UTC). It is an HTML page, not a .docx.
- **Specification:** "Gloxad LMS Backend Technical Specification Ver 1" (the PDF given to the backend team).
- **Method:** I read the documentation page and sent read-only requests to the live server to confirm the documented routes exist. A 401 means the route exists and is guarded.

## What changed since 11 November

The documentation now covers the grading engine and the final project, and the categories and providers work from the earlier summary is live.

| Spec area | Status now | Detail |
|---|---|---|
| Q1: 18 categories, tags, pathways, aliases, deactivate | Done | `GET /api/categories` returns `tags`, `pathways`, `aliases` and `isActive`. `PUT /api/admin/categories/:id/status` deactivates without deleting. |
| Q2: providers and attribution | Done, registry empty | `GET /api/providers`, `/api/providers/:idOrSlug` and admin create, update and deactivate. Ownership classes `gloxad_produced`, `licensed_partner`, `externally_curated` and an embed policy. No provider exists yet and every course has `provider: null`. |
| Q4: final project with tutor review and administrator approval | Documented | Routes for the project, stage, review, stage submit (resubmission allowed) and `PUT /api/lms/final-projects/:projectId/admin-approve`. Approval locks the score and unlocks programme certificate eligibility. |
| Q4/Q5: grading engine and weights | Documented | `GET /api/lms/cohorts/:cohortId/gradebook`, `/gradebook/export` (CSV), `/my-transcript`, `PUT /gradebook/override`, `PUT /assessment-weights`. Seven categories with the spec's default weights (15, 15, 15, 10, 10, 10, 25) that must total 100. |
| Q5: 70% certificate threshold | Documented | The gradebook and transcript return a pass flag and `certificateEligibility` at 70% or more. |
| Audit history for grade changes (spec 12.1) | Documented | `GET /api/lms/cohorts/:cohortId/grade-audits` lists overrides and weight changes with the actor and the old and new values. |

All eight new routes answered 401 on the live server, so they exist and are guarded.

## Still missing or not shown

| Spec requirement | Status in the docs | Detail |
|---|---|---|
| Q3: 22-node trail (nodeIndex 1 to 22, phase, completion criteria) | Not shown | The curriculum response is still weekly modules with lessons, a quiz and an assignment. `nodeIndex` does not appear anywhere in the docs. The team's summary says it was built, so an example response is needed. |
| Q4/Q5: late and resubmission caps | Not shown | Weights exist; no cap policy is described. |
| Q6: automatic recording with processing, available and failed states, replay access | Missing | The only recording field is a manually supplied `recordingUrl`. No Egress, no lifecycle states, no replay route. |
| Q6: YouTube Live as the secondary option | Missing | Not mentioned. |
| Q7: persistent workspace with cloud autosave, versions and recovery | Missing | "Workspace" in the docs means the institution workspace. There is no autosave route. |
| Q7: GitHub connect, push, pull, commit-based submission | Missing | GitHub appears only as a social link and in example data. |
| Q7: server-side code execution | Missing | Not documented. The spec requires an independent security review first. |
| Notifications and per-endpoint error codes | Partial | General HTTP codes are listed. The spec asks for per-endpoint error codes and event contracts. |

## Not on the live server yet

These exist in the local backend repository but return 404 on the live server and are not in the documentation:

- `GET /api/lms/public/trimesters`, `GET /api/lms/public/trimesters/:id`, `POST /api/lms/trimesters/:id/enrol`
- Scholarships: public list, apply, admin create and review
- Coding labs: `GET /api/lms/code-labs` and submissions
- Inquiries: `/api/lms/inquiries`
- Practice workspaces: `/api/practice/workspaces`

The live server serves a different LMS route design from the one the web app was built against. See `Gloxad-Trimester-Tasks-and-Milestones.pdf` for the plan to align them.

## Mismatches inside the documentation itself

- The introduction says the portal documents "51 REST API endpoints and 8 Socket.io events", but the page documents far more. The count is out of date.
- Where `70%` appears in the payment section it is the instructor revenue share, not the certificate threshold. The certificate threshold is documented separately in the gradebook section.
