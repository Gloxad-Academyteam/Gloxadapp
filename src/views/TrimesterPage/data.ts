import TrimesterUiux from "@assets/images/trimester-uiux.png";
import CourseUiuxBeginner from "@assets/images/course-uiux-beginner.png";
import CourseBrandDesign from "@assets/images/course-brand-design.png";
import CourseMotionDesign from "@assets/images/course-motion-design.png";
import type { StaticImageData } from "next/image";

export type TrimesterCourse = {
  slug: string;
  title: string;
  summary: string;
  image: StaticImageData;
  closes: string;
  starts: string;
  duration: string;
  level: string;
  format: string;
  outcomes: string[];
  about: string;
  skills: string[];
  modules: { title: string; detail: string }[];
  audience: string[];
};

export const trimesterCourses: TrimesterCourse[] = [
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    summary: "Master the art of user experience and interface design. Learn Figma, wireframing, prototyping, and user research.",
    image: TrimesterUiux,
    closes: "March 10, 2026",
    starts: "March 17, 2026",
    duration: "12 weeks",
    level: "Beginner",
    format: "Cohort-based, live + self-paced",
    outcomes: [
      "Design clean, usable interfaces in Figma from scratch.",
      "Run user research and turn findings into design decisions.",
      "Build interactive prototypes and test them with real users.",
      "Finish with a portfolio-ready case study.",
    ],
    about:
      "This trimester course takes you from design fundamentals to a finished case study. You will learn how to research users, map their journeys, sketch wireframes, build polished interfaces and prototype the result, with feedback from tutors and your cohort along the way.",
    skills: ["Figma", "Wireframing", "Prototyping", "User Research", "Design Systems", "Usability Testing"],
    modules: [
      { title: "Design foundations", detail: "Layout, typography, colour and hierarchy." },
      { title: "User research", detail: "Interviews, personas and journey maps." },
      { title: "Wireframing", detail: "Low- and high-fidelity flows." },
      { title: "UI design in Figma", detail: "Components, auto layout and design systems." },
      { title: "Prototyping & testing", detail: "Interactive prototypes and usability sessions." },
      { title: "Capstone case study", detail: "Present a complete project to your cohort." },
    ],
    audience: ["Career changers moving into design", "Developers who want to design better", "Students building a first portfolio"],
  },
  {
    slug: "frontend-development",
    title: "Frontend Development",
    summary: "Learn modern web interfaces using HTML, CSS, JavaScript, React, and responsive development practices.",
    image: CourseUiuxBeginner,
    closes: "March 24, 2026",
    starts: "March 31, 2026",
    duration: "14 weeks",
    level: "Beginner to Intermediate",
    format: "Cohort-based, live + self-paced",
    outcomes: [
      "Build responsive websites with semantic HTML and modern CSS.",
      "Write clean JavaScript and work with APIs.",
      "Create component-based apps with React.",
      "Ship and deploy a complete project.",
    ],
    about:
      "Start with the building blocks of the web and progress to component-driven applications in React. Every module ends with a hands-on project, and the final trimester project is reviewed by a tutor before you graduate.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"],
    modules: [
      { title: "HTML & CSS essentials", detail: "Semantic markup, flexbox and grid." },
      { title: "JavaScript fundamentals", detail: "Types, functions, DOM and async code." },
      { title: "Working with APIs", detail: "Fetching, handling and displaying data." },
      { title: "React basics", detail: "Components, props, state and hooks." },
      { title: "Tooling & deployment", detail: "Git, package managers and hosting." },
      { title: "Capstone project", detail: "Build and launch a real application." },
    ],
    audience: ["Beginners who want a structured path", "Designers who want to code", "Self-taught learners filling gaps"],
  },
  {
    slug: "data-analysis",
    title: "Data Analysis",
    summary: "Build practical analytics skills with spreadsheets, dashboards, visualization, and real-world reporting projects.",
    image: CourseBrandDesign,
    closes: "April 4, 2026",
    starts: "April 11, 2026",
    duration: "12 weeks",
    level: "Beginner",
    format: "Cohort-based, live + self-paced",
    outcomes: [
      "Clean and structure messy data with spreadsheets and SQL.",
      "Explore data and find the story behind the numbers.",
      "Build clear dashboards and visual reports.",
      "Present findings to non-technical audiences.",
    ],
    about:
      "Learn the full analysis workflow: collecting and cleaning data, exploring it, visualising what matters and communicating results. Projects use realistic business datasets so you finish with work you can show employers.",
    skills: ["Spreadsheets", "SQL", "Data Cleaning", "Dashboards", "Visualization", "Reporting"],
    modules: [
      { title: "Analytics foundations", detail: "Questions, metrics and the analysis lifecycle." },
      { title: "Spreadsheets in depth", detail: "Formulas, pivots and cleaning techniques." },
      { title: "SQL for analysts", detail: "Querying, joining and aggregating data." },
      { title: "Data visualization", detail: "Choosing the right chart and telling a story." },
      { title: "Dashboards", detail: "Interactive reporting for stakeholders." },
      { title: "Capstone report", detail: "A full analysis from raw data to recommendation." },
    ],
    audience: ["Anyone starting a data career", "Business professionals who report on numbers", "Students adding a job-ready skill"],
  },
  {
    slug: "product-marketing",
    title: "Product Marketing",
    summary: "Learn positioning, campaign strategy, customer research, and performance-focused digital marketing.",
    image: CourseMotionDesign,
    closes: "April 18, 2026",
    starts: "April 25, 2026",
    duration: "10 weeks",
    level: "Beginner",
    format: "Cohort-based, live + self-paced",
    outcomes: [
      "Position a product and write a clear value proposition.",
      "Research customers and segment your audience.",
      "Plan and launch multi-channel campaigns.",
      "Measure results and optimise performance.",
    ],
    about:
      "Understand how great products reach the right people. You will practise positioning, messaging and go-to-market planning, then run and measure a campaign brief in your final project.",
    skills: ["Positioning", "Messaging", "Customer Research", "Campaign Strategy", "Analytics", "Go-to-market"],
    modules: [
      { title: "Marketing fundamentals", detail: "Markets, customers and the funnel." },
      { title: "Positioning & messaging", detail: "Craft a value proposition that lands." },
      { title: "Customer research", detail: "Interviews, surveys and segmentation." },
      { title: "Campaign strategy", detail: "Channels, budgets and calendars." },
      { title: "Measuring performance", detail: "KPIs, attribution and reporting." },
      { title: "Capstone launch plan", detail: "Present a go-to-market plan to your cohort." },
    ],
    audience: ["Aspiring marketers and founders", "Product managers who own launches", "Creatives moving into strategy"],
  },
];
