# Gloxad Academy: Comprehensive Technical Audit & Status Report

**Date:** June 8, 2026  
**Subject:** Nitty-Gritty Project Status, Missing Features, and Developer Audit

This document serves as a low-level, technical audit of the Gloxad Academy (v2) repository across both the frontend (`ng_frontend`) and backend (`ng_backend`). It details exactly what was built, what was mocked, and what critical e-learning features and backend services were completely skipped by the initial developer.

---

## 1. Executive Summary

- **Frontend Progress:** The previous developer focused almost exclusively on creating a standalone React component library and a few high-level pages (Homepage, Search, Auth). However, they did not build out the core e-learning interfaces (Course Player, Checkout, Dashboards).
- **Backend Progress:** **0% Complete.** The NestJS backend is entirely uninitialized boilerplate. No database, no schemas, and no API endpoints have been created.
- **Data Integrity:** The frontend relies on Mock Service Worker (MSW) to intercept its own network requests and return fake, hardcoded JSON data. Nothing is real or persistent.

---

## 2. Screens & Pages Audit

Based on standard e-learning platforms (like Udemy or Coursera) and the provided Figma scopes, we can estimate a minimum of ~15 core screens.

**Total Screens Estimated to Complete App:** ~15  
**Screens Built:** 6  
**Screens Missing / Not Created Yet:** ~9  

### ✅ Screens Built (6)
1. **Homepage (`IndexPage`)**: The main landing page displaying featured/recommended courses.
2. **Search Results (`SearchResultsPage`)**: The page displaying paginated search results for courses.
3. **Sign In (`SignInPage`)**: User login.
4. **Sign Up (`SignUpPage`)**: User registration.
5. **Forgot Password (`ForgetPasswdPage`)**: Password recovery request.
6. **Reset Password (`ResetPasswdPage`)**: Password recovery execution.

### ❌ Screens NOT Created Yet (Missing / Skipped) (~9)
These are the critical screens that have not been touched and do not exist in the codebase:
1. **Course Details / Landing Page**: The dedicated page for a single course showing the curriculum, instructor bio, and reviews.
2. **Learning Environment / Video Player**: The actual course consumption interface where a student watches videos, tracks progress, and takes quizzes.
3. **Checkout / Cart Flow**: The UI for purchasing a course and entering payment details.
4. **Student Dashboard (My Courses)**: The page where a student views the courses they have purchased.
5. **User Profile Settings**: The screen to manage avatars, payment methods, and account details.
6. **Instructor Dashboard**: The portal for instructors to view their revenue, manage students, and see course analytics.
7. **Course Creation Wizard**: The UI for instructors to upload videos and build their curriculum.
8. **Categories / Browse Page**: A dedicated directory to browse courses by specific topics.
9. **Public Instructor Profile**: A page listing all courses taught by a specific instructor.

### ⚠️ Screens That Need Improvement / Updating
- **Homepage & Search Results**: Currently populated with hardcoded fake data. They must be updated to handle loading states, empty states, and actual API integration.
- **Authentication Pages**: They visually exist but need to be wired up to actual JWT storage and state management (e.g., Redux or React Context) so the app knows when a user is actually logged in.

---

## 3. Backend Services & API Audit

The backend is currently a fresh NestJS template. **No backend services have been built.** 

However, the frontend developer mapped out specific API endpoints in `src/constants/routes.ts` and created **Fake Mock Services** for them. 

### 🪟 Mocked Services (Assumed by Frontend, but missing in Backend)
The following 12 endpoints need to be built immediately to satisfy the frontend's current UI requirements:

**Auth Service:**
- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forget-passwd`
- `POST /auth/reset-passwd`

**Courses Service:**
- `GET /courses/list` (with `?recommended=true` or `?featured=true` parameters)
- `GET /courses/search` (with pagination, language, and rating filters)
- `GET /courses/because-you-viewed`

**Interactions Service:**
- `POST /report` (Reporting a course/user)
- `POST /vote/up` (Upvoting a course/review)
- `POST /vote/down` (Downvoting)

### ❌ Skipped Services (Not Mapped & Not Built)
Because the core e-learning screens were skipped, the API layer for those features was also completely ignored. The following backend modules must be engineered from scratch:

1. **Database Schema & ORM**: No Postgres/MongoDB setup exists.
2. **Payments & Enrollment Service**: Stripe/PayPal integration to handle transactions and grant users access to courses.
3. **Video / Media Streaming Service**: Secure video delivery (e.g., AWS S3, Cloudflare Stream) ensuring users cannot just download videos without paying.
4. **Progress Tracking Service**: APIs to track which video a user is on, and mark modules as completed.
5. **Course Upload / Curriculum Service**: APIs for instructors to create courses, upload assets, and publish.
6. **Reviews Service**: APIs to leave star ratings and written reviews on courses.

---

## 4. UI Components Built (Nitty-Gritty)
The one area the previous developer spent significant time on is the underlying component library. These are isolated UI building blocks found in `src/components`:

- **Layout & Navigation:** `Header`, `PageWrapper`, `BreadCrumb`, `PaginationNavigator`
- **Data Display:** `CourseItem`, `CourseSection`, `InstructorItem`, `ReviewItemBox`, `Stars`, `Avatar`, `ImageComponent`
- **Forms & Inputs:** `Button`, `Input`, `LocalPinInput`, `RadioCheckbox`, `RichText`
- **Modals:** `Modal`, `ModalContent`, `ReportModalContent`, `SuccessModalContent`

*Note: While these components are built, many of them are currently only visible on an internal `/demo` route and are not yet assembled into real, functional pages.*

---

## 5. Conclusion & Verdict for the Client

**Verdict:** The initial developer built a "UI Prototype" rather than a functional application. 

They successfully created the design system, the homepage, the search page, and the login screens. However, they bypassed all of the difficult engineering work: the backend database, actual authentication, payment gateways, video delivery, and the core learning dashboard.

To complete this project, the new development team will need to:
1. Design the database architecture.
2. Build the entire NestJS backend from scratch.
3. Build the missing ~9 critical frontend screens (Course Player, Checkout, Dashboards).
4. Rip out the Mock Service Worker (MSW) in the frontend and wire it to the real backend.
