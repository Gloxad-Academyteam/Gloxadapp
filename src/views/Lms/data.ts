// Demo content for the Gloxad LMS screens. Replace with API data when the LMS endpoints exist.
import { lmsImages } from "./images";

export const TOP_TABS = [
  { key: "trimesters", label: "Trimesters", href: "/lms" },
  { key: "resources", label: "Resources", href: null },
  { key: "certificates", label: "Certificates", href: "/lms/certificates" },
] as const;

export type TTopTab = (typeof TOP_TABS)[number]["key"];

/* ---------- Student dashboard ---------- */
export const STUDENT_PROGRESS = {
  overall: 65,
  breakdown: [
    { label: "Week 2", value: "40%", percent: 40 },
    { label: "Assignments", value: "5/8", percent: 62.5 },
    { label: "Attendance", value: "100%", percent: 100 },
  ],
};

export const UPCOMING_ACTIVITIES = [
  { kind: "Reading", title: "Advanced Hooks Concept", due: "Due today at 11:59 PM", href: "/lms/curriculum/lesson", tone: "reading" },
  { kind: "Assignment", title: "Build a Todo App", due: "Due tomorrow at 5:00 PM", href: "/lms/assignments", tone: "assignment" },
  { kind: "Live Class", title: "Weekly Code Review", due: "Thursday, 10:00 AM", href: "/lms/live", tone: "live" },
  { kind: "Milestone", title: "Project Phase 1 Submit", due: "Friday, EOD", href: "/lms/assignments", tone: "milestone" },
] as const;

export const ANNOUNCEMENTS = [
  { time: "Today, 09:00 AM", title: "Class schedule updated", text: "Thursday's live session has been moved to 10:00 AM EST to..." },
  { time: "Yesterday, 14:30 PM", title: "Assignment 4 Tips posted", text: "Check the resources folder for supplementary materials on API..." },
];

/* ---------- Lesson ---------- */
export const LESSON = {
  trimester: "Trimester 2",
  module: "Module 4: Advanced Systems",
  title: "Lesson 4.2: Scalable Architecture Patterns",
  progress: 42,
  objectives: [
    { text: "Differentiate between horizontal and vertical scaling strategies.", done: true },
    { text: "Identify the core components of a microservices architecture.", done: false },
    { text: "Design a basic load-balanced system topology.", done: false },
  ],
  upNext: [
    { title: "4.3 Database Sharding", meta: "18 mins", kind: "video", href: "/lms/curriculum/lesson" },
    { title: "4.4 Event-Driven Design", meta: "Reading", kind: "reading", href: "/lms/curriculum/lesson" },
    { title: "Module 4 Quiz", meta: "10 questions", kind: "quiz", href: "/lms/quiz" },
  ],
  intro:
    "In this lesson, we explore the fundamental principles of scalable system design, moving beyond monolithic architectures into distributed environments.",
  concepts: [
    ["Horizontal vs. Vertical Scaling", "Understanding when to add more power to an existing machine (vertical) versus adding more machines to a pool of resources (horizontal)."],
    ["Microservices Architecture", "Breaking down complex applications into smaller, independent services that communicate over well-defined APIs."],
    ["Load Balancing", "Distributing incoming network traffic across multiple servers to ensure no single server bears too much demand."],
  ],
  tip: "Always design for failure. In distributed systems, partial failures are inevitable. Implement robust retry mechanisms and circuit breakers.",
  outro: "Review the attached PDF for a deep dive into caching strategies using Redis and Memcached before moving to the next section.",
  file: { name: "Architecture_Diagrams.pdf", size: "2.4 MB" },
};

export type TComment = { id: string; initials: string; name: string; role?: "Instructor"; time: string; text: string; likes: number; replies?: TComment[] };

export const LESSON_COMMENTS: TComment[] = [
  {
    id: "c1",
    initials: "AL",
    name: "Alice Lin",
    time: "2 hours ago",
    text: "How do we handle state in a truly stateless microservice architecture? Are we just relying entirely on external DBs?",
    likes: 4,
    replies: [
      {
        id: "c2",
        initials: "MR",
        name: "Mark Rivera",
        role: "Instructor",
        time: "1 hour ago",
        text: "Great question. Yes, typically state is pushed to distributed caches (like Redis) or managed databases. The service instances themselves remain ephemeral.",
        likes: 2,
      },
    ],
  },
];

/* ---------- Live class ---------- */
export const LIVE_CLASS = {
  title: "Data Structures: Advanced Trees & Graphs",
  instructor: "Dr. Emily Chen (Instructor)",
  next: { title: "Machine Learning 101", startsIn: 8 * 60 + 45 },
  participants: [
    { name: "Alex M.", image: lmsImages.studentHeadphones, muted: true },
    { name: "Sarah K.", image: lmsImages.studentSmiling, muted: true },
    { name: "David L.", image: lmsImages.studentMan, muted: false },
  ],
  chat: [
    { id: "m1", author: "David L.", time: "10:14 AM", text: "Could you explain the time complexity of the last traversal method again?" },
    { id: "m2", author: "Sarah K.", time: "10:15 AM", text: "I think it's O(V+E) for BFS." },
  ],
  poll: {
    question: "What is the time complexity of BFS on a graph with V vertices and E edges?",
    options: ["O(V)", "O(V + E)", "O(V × E)", "O(log V)"],
  },
  people: [
    "Dr. Emily Chen (Instructor)", "Alex Mercer (You)", "Sarah Kim", "David Lopez", "Priya Nair", "Tomás Herrera", "Amara Okoye",
    "Li Wei", "Elena Rostova", "James Thompson", "Fatima Al-Sayed", "Marcus King", "Yuki Tanaka", "Grace Mwangi", "Anthony Cole",
    "Linda Torres", "Noah Bennett", "Chloe Martin", "Ibrahim Yusuf", "Sofia Rossi", "Daniel Park", "Zainab Bello", "Oliver Grant", "Mei Ling",
  ],
};

/* ---------- Assignments ---------- */
export type TAssignmentStatus = "not_started" | "graded" | "pending_review" | "submitted";

export type TAssignment = {
  id: string;
  module: string;
  title: string;
  summary: string;
  due: string;
  dueBadge: string;
  dueDate: string;
  urgent?: boolean;
  past: boolean;
  status: TAssignmentStatus;
  progress: number;
  description: string;
  rubric: { criterion: string; points: number }[];
};

export const ASSIGNMENTS: TAssignment[] = [
  {
    id: "a3",
    module: "Module 3",
    title: "Advanced API Integration",
    summary: "Implement RESTful endpoints for user authentication and data retrieval using...",
    due: "Due Tomorrow",
    dueBadge: "Module 3 Project",
    dueDate: "Oct 25, 11:59 PM",
    urgent: true,
    past: false,
    status: "not_started",
    progress: 0,
    description:
      "In this assignment, you will build a robust RESTful API using Node.js and Express. Focus on secure authentication, efficient database querying, and proper error handling.",
    rubric: [
      { criterion: "Authentication and authorisation", points: 30 },
      { criterion: "Endpoint design and error handling", points: 30 },
      { criterion: "Database queries and performance", points: 25 },
      { criterion: "Code quality and documentation", points: 15 },
    ],
  },
  {
    id: "a2b",
    module: "Module 2",
    title: "Database Schema Design",
    summary: "Design a normalised schema for the course platform and justify your indexing choices.",
    due: "Due Oct 15",
    dueBadge: "Module 2 Project",
    dueDate: "Oct 15, 11:59 PM",
    past: true,
    status: "graded",
    progress: 100,
    description: "Design a normalised relational schema for a course platform, including entity relationships, constraints and indexes, and justify each design decision.",
    rubric: [
      { criterion: "Normalisation and relationships", points: 40 },
      { criterion: "Constraints and indexing", points: 30 },
      { criterion: "Written justification", points: 30 },
    ],
  },
  {
    id: "a2a",
    module: "Module 2",
    title: "UI Component Library",
    summary: "Build a small, accessible component library with documented props and usage examples.",
    due: "Due Oct 01",
    dueBadge: "Module 2 Project",
    dueDate: "Oct 01, 11:59 PM",
    past: true,
    status: "pending_review",
    progress: 90,
    description: "Build a small, accessible component library (buttons, inputs, modal) with documented props and usage examples.",
    rubric: [
      { criterion: "Component API and reusability", points: 40 },
      { criterion: "Accessibility", points: 35 },
      { criterion: "Documentation", points: 25 },
    ],
  },
];

/* ---------- Community ---------- */
export const CHANNELS = [
  { id: "general", label: "General", count: 42 },
  { id: "qa", label: "Q&A" },
  { id: "showcase", label: "Project Showcase", isNew: true },
  { id: "study", label: "Study Groups" },
] as const;

export type TPost = {
  id: string;
  author: string;
  initials: string;
  image?: string;
  instructor?: boolean;
  time: string;
  channel: (typeof CHANNELS)[number]["id"];
  tag: string;
  title: string;
  body: string;
  likes: number;
  replies: number;
};

export const POSTS: TPost[] = [
  {
    id: "p1",
    author: "Sarah Jenkins",
    initials: "SJ",
    image: lmsImages.womanA,
    time: "2 hours ago",
    channel: "general",
    tag: "Discussion",
    title: "Best resources for Advanced React patterns?",
    body: "I'm struggling a bit with the latest module on custom hooks and context API. Does anyone have good supplementary reading or tutorials they...",
    likes: 12,
    replies: 5,
  },
  {
    id: "p2",
    author: "Marcus Johnson",
    initials: "MJ",
    instructor: true,
    time: "5 hours ago",
    channel: "showcase",
    tag: "Showcase",
    title: "Mid-term Project Submissions are looking great!",
    body: "Just wanted to give a quick shoutout to the cohort. The level of detail in the recent UI prototypes is outstanding. Keep up the good work and don't forget to review the feedback rubric.",
    likes: 45,
    replies: 12,
  },
];

/* ---------- Certificates ---------- */
export const IN_PROGRESS = [
  { trimester: "Trimester 3", title: "Advanced Machine Learning Architecture", expected: "Nov 2024", progress: 75, icon: "cap" },
  { trimester: "Trimester 2", title: "Cloud-Native Application Deployment", expected: "Aug 2024", progress: 92, icon: "code" },
] as const;

export const EARNED = [
  { badge: "Gloxad Certified", completed: "May 15, 2024", title: "Full-Stack Web Development", subtitle: "Trimester 1 Core Curriculum", tone: "navy" },
  { badge: "Specialization", completed: "Feb 10, 2024", title: "Data Structures & Algorithms", subtitle: "Foundation Module", tone: "blue" },
] as const;

/* ---------- Quiz ---------- */
export type TQuestion = { prompt: string; hint?: string; options: string[]; answer: number };

export const QUIZ = {
  course: "Advanced Machine Learning Concepts",
  name: "Module 4 Quiz",
  minutes: 15,
  questions: [
    {
      prompt: "What does it mean when a machine learning model is overfitting?",
      hint: "Think about how the model behaves on data it has not seen before.",
      options: [
        "It performs well on training data but poorly on unseen data.",
        "It performs poorly on both training and unseen data.",
        "It trains faster than expected on large datasets.",
        "It cannot be improved by adding more data.",
      ],
      answer: 0,
    },
    {
      prompt: "Which of the following is a common technique for reducing overfitting?",
      hint: "Consider methods that constrain what the model can memorise.",
      options: [
        "Increasing the number of layers without limit.",
        "Applying regularization such as dropout or weight decay.",
        "Training for more epochs without monitoring validation loss.",
        "Removing the validation set to use more training data.",
      ],
      answer: 1,
    },
    {
      prompt: "In the context of Neural Networks, what is the primary purpose of the activation function?",
      hint: "Consider the role it plays in allowing the network to learn complex patterns.",
      options: [
        "To initialize the weights of the network before training begins.",
        "To introduce non-linearity into the output of a neuron.",
        "To normalize the input data to speed up the convergence of gradient descent.",
        "To compute the error between the predicted output and the actual target value.",
      ],
      answer: 1,
    },
    {
      prompt: "Which loss function is most commonly used for binary classification?",
      hint: "It compares predicted probabilities with the true 0/1 labels.",
      options: ["Mean squared error", "Binary cross-entropy", "Mean absolute error", "Huber loss"],
      answer: 1,
    },
    {
      prompt: "What does gradient descent do during training?",
      hint: "Think about how the parameters are updated at each step.",
      options: [
        "It randomly searches the parameter space for a lower loss.",
        "It adjusts parameters in the direction that reduces the loss.",
        "It removes features that have low variance.",
        "It splits the data into training and test sets.",
      ],
      answer: 1,
    },
    {
      prompt: "The vanishing gradient problem is most associated with which activation function in deep networks?",
      hint: "Its derivative becomes very small for large positive or negative inputs.",
      options: ["ReLU", "Sigmoid", "Identity (linear)", "Leaky ReLU"],
      answer: 1,
    },
    {
      prompt: "What is the main purpose of a validation set?",
      hint: "It is used while you are still developing the model.",
      options: [
        "To report the final performance of the model to stakeholders.",
        "To tune hyperparameters and monitor generalization during training.",
        "To increase the size of the training data.",
        "To store the trained weights.",
      ],
      answer: 1,
    },
    {
      prompt: "What does the learning rate control?",
      hint: "Too large and training diverges; too small and it crawls.",
      options: [
        "The number of layers in the network.",
        "The size of the parameter updates at each step.",
        "The proportion of data used for testing.",
        "The number of features fed to the model.",
      ],
      answer: 1,
    },
    {
      prompt: "Which of these is required for supervised learning?",
      hint: "The algorithm learns a mapping from inputs to known outputs.",
      options: [
        "Labeled examples of inputs and outputs.",
        "A reward signal from an environment.",
        "Only unlabeled data.",
        "A pre-trained language model.",
      ],
      answer: 0,
    },
    {
      prompt: "Which metric is usually more informative than accuracy when classes are heavily imbalanced?",
      hint: "Accuracy can look high even if the minority class is always missed.",
      options: ["Accuracy", "F1 score", "Training time", "Number of parameters"],
      answer: 1,
    },
  ] as TQuestion[],
};

/* ---------- Instructor cohort overview ---------- */
export const COHORT = {
  trimester: "Trimester 2: Advanced Software Architecture",
  avgCompletion: 68,
  active: { now: 42, total: 45, delta: "+2 this week" },
  avgGrade: "B+",
  gradingPending: 12,
  grading: [
    { module: "Module 4", title: "System Design Case Study", student: "Sarah Jenkins", ago: "2h ago", image: lmsImages.womanA },
    { module: "Module 4", title: "System Design Case Study", student: "Marcus King", ago: "5h ago", initials: "MK" },
    { module: "Module 3", title: "API Architecture Quiz", student: "David Chen", ago: "Overdue", image: lmsImages.manB, overdue: true },
  ],
  liveClass: "Live Class 4: Microservices (Oct 24)",
};

export type TRosterStudent = { name: string; email: string; status: "Present" | "Absent" | "Excused"; progress: number; lastActive: string; image?: string; initials?: string };

const ROSTER_SEED: TRosterStudent[] = [
  { name: "Elena Rostova", email: "erostova@gloxad.edu", status: "Present", progress: 92, lastActive: "Today, 09:41 AM", image: lmsImages.womanB },
  { name: "James Thompson", email: "jthompson@gloxad.edu", status: "Absent", progress: 45, lastActive: "3 days ago", initials: "JT" },
  { name: "Li Wei", email: "lwei@gloxad.edu", status: "Excused", progress: 78, lastActive: "Yesterday, 04:20 PM", image: lmsImages.manA },
  { name: "Priya Nair", email: "pnair@gloxad.edu", status: "Present", progress: 88, lastActive: "Today, 08:15 AM", initials: "PN" },
  { name: "Tomás Herrera", email: "therrera@gloxad.edu", status: "Present", progress: 71, lastActive: "Today, 07:50 AM", initials: "TH" },
  { name: "Amara Okoye", email: "aokoye@gloxad.edu", status: "Absent", progress: 52, lastActive: "2 days ago", initials: "AO" },
  { name: "Noah Bennett", email: "nbennett@gloxad.edu", status: "Present", progress: 95, lastActive: "Today, 10:02 AM", initials: "NB" },
  { name: "Zainab Bello", email: "zbello@gloxad.edu", status: "Excused", progress: 66, lastActive: "Yesterday, 11:30 AM", initials: "ZB" },
];

export const ROSTER = ROSTER_SEED;

/* ---------- Admin analytics ---------- */
export const ADMIN_STATS = [
  { label: "Total Revenue", value: "$124.5K", note: "+12% from last trimester", tone: "up", icon: "chart" },
  { label: "Enrollment Counts", value: "3,492", note: "+5.4% new students", tone: "up", icon: "users" },
  { label: "Completion Rates", value: "87%", note: "Steady across cohorts", tone: "flat", icon: "cap" },
  { label: "Platform Health", value: "99.9%", note: "Uptime this month", tone: "ok", icon: "shield" },
] as const;

export const ENROLLMENT_TRENDS = [38, 62, 46, 78, 95, 68];

export const RECENT_CERTIFICATES = [
  { title: "Advanced Data Science", who: "Sarah J.", ago: "2 mins ago" },
  { title: "Corporate Leadership", who: "Michael T.", ago: "15 mins ago" },
  { title: "UI/UX Masterclass", who: "Elena R.", ago: "1 hr ago" },
  { title: "Business Strategy", who: "David L.", ago: "3 hrs ago" },
];

export type TAdminUser = { name: string; email: string; role: "Instructor" | "Student"; status: "Active" | "Suspended"; lastLogin: string; image?: string };

const FIRST = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Mohammed", "Nina", "Oscar"];
const LAST = ["Freeman", "Johnson", "Davis", "Okafor", "Nguyen", "Silva", "Kowalski", "Haddad", "Murphy", "Tanaka", "Adeyemi", "Rossi"];

export const ADMIN_USERS: TAdminUser[] = Array.from({ length: 45 }, (_, index) => {
  if (index === 0) return { name: "Alice Freeman", email: "alice@example.com", role: "Instructor", status: "Active", lastLogin: "Today, 09:41 AM", image: lmsImages.womanB };
  if (index === 1) return { name: "Bob Johnson", email: "bob.j@example.com", role: "Student", status: "Active", lastLogin: "Yesterday, 14:20 PM" };
  if (index === 2) return { name: "Charlie Davis", email: "charlie.d@example.com", role: "Student", status: "Suspended", lastLogin: "Oct 12, 2023", image: lmsImages.manB };
  const first = FIRST[index % FIRST.length];
  const last = LAST[(index * 7) % LAST.length];
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    role: index % 9 === 0 ? "Instructor" : "Student",
    status: index % 11 === 0 ? "Suspended" : "Active",
    lastLogin: index % 4 === 0 ? `Oct ${(index % 27) + 1}, 2023` : index % 3 === 0 ? "Yesterday, 10:05 AM" : "Today, 08:30 AM",
  };
});


/* ---------- Weekly learning path (Curriculum) ---------- */
export type TDayItem = {
  kind: "video" | "reading" | "code" | "check" | "live" | "problems" | "review" | "submission";
  label: string;
  // Set when the item comes from the API: lets a student tick it off, and opens the right coding lab
  id?: string;
  done?: boolean;
  labSlug?: string | null;
};
export type TDayStatus = "done" | "today" | "available" | "upcoming" | "locked";
export type TPathDay = {
  day: string;
  status: TDayStatus;
  module?: string;
  title?: string;
  items?: TDayItem[];
  // Today's card shows how far through the day's work the student is
  progress?: number;
};
export type TPathWeek = {
  week: number;
  objective: { title: string; text: string; progress: number };
  estimatedHours: number;
  concepts: string[];
  days: TPathDay[];
};

export const PATH_PROGRAM = { trimester: "TRIMESTER 2", course: "Data Structures & Algorithms" };

export const PATH_WEEKS: TPathWeek[] = [
  {
    week: 1,
    objective: {
      title: "Complexity & Core Data Structures",
      text: "By the end of this week, you will analyse algorithm complexity with Big-O, and implement arrays, linked lists, stacks and queues from scratch.",
      progress: 100,
    },
    estimatedHours: 10,
    concepts: ["Big-O", "Arrays", "Linked Lists", "Stacks & Queues"],
    days: [
      { day: "Monday", status: "done", module: "Module 1.1", title: "Algorithm Analysis & Big-O", items: [{ kind: "video", label: "50m Video" }, { kind: "reading", label: "Reading (15m)" }] },
      { day: "Tuesday", status: "done", module: "Module 1.2", title: "Arrays & Linked Lists", items: [{ kind: "code", label: "Coding Lab (1h)" }, { kind: "check", label: "Knowledge Check" }] },
      { day: "Wednesday", status: "done", module: "Module 1.3", title: "Stacks & Queues", items: [{ kind: "live", label: "Live Lecture (2h)" }, { kind: "problems", label: "Problem Set 1" }] },
      { day: "Thursday", status: "done", module: "Module 1.4", title: "Recursion Patterns", items: [{ kind: "code", label: "Coding Lab (1.5h)" }, { kind: "review", label: "Peer Review" }] },
      { day: "Friday", status: "done", module: "Assessment", title: "Weekly Challenge: Data Structure Toolkit", items: [{ kind: "submission", label: "Project Submission" }] },
      { day: "Saturday", status: "locked" },
      { day: "Sunday", status: "locked" },
    ],
  },
  {
    week: 2,
    objective: {
      title: "Mastering Graph Theory Fundamentals",
      text: "By the end of this week, you will confidently implement directed and undirected graphs, understand adjacency matrices vs. lists, and execute core traversal algorithms (BFS/DFS) to solve complex routing problems.",
      progress: 40,
    },
    estimatedHours: 12,
    concepts: ["BFS", "DFS", "Dijkstra's", "Adjacency List"],
    days: [
      { day: "Monday", status: "done", module: "Module 2.1", title: "Introduction to Graphs & Terminology", items: [{ kind: "video", label: "45m Video" }, { kind: "reading", label: "Reading (15m)" }] },
      { day: "Tuesday", status: "done", module: "Module 2.2", title: "Graph Representations (Code)", items: [{ kind: "code", label: "Coding Lab (1h)" }, { kind: "check", label: "Knowledge Check" }] },
      { day: "Wednesday", status: "today", module: "Module 2.3", title: "Breadth-First Search (BFS) Deep Dive", progress: 50, items: [{ kind: "live", label: "Live Lecture (2h)" }, { kind: "problems", label: "Problem Set 1" }] },
      { day: "Thursday", status: "upcoming", module: "Module 2.4", title: "Depth-First Search (DFS) Variations", items: [{ kind: "code", label: "Coding Lab (1.5h)" }, { kind: "review", label: "Peer Review" }] },
      { day: "Friday", status: "upcoming", module: "Assessment", title: "Weekly Challenge: Graph Routing Project", items: [{ kind: "submission", label: "Project Submission" }] },
      { day: "Saturday", status: "locked" },
      { day: "Sunday", status: "locked" },
    ],
  },
  {
    week: 3,
    objective: {
      title: "Shortest Paths & Greedy Algorithms",
      text: "By the end of this week, you will apply Dijkstra's algorithm and greedy strategies to weighted graphs and justify when each approach is correct.",
      progress: 0,
    },
    estimatedHours: 12,
    concepts: ["Dijkstra's", "Greedy", "Priority Queue", "Heaps"],
    days: [
      { day: "Monday", status: "locked", module: "Module 3.1", title: "Weighted Graphs & Priority Queues" },
      { day: "Tuesday", status: "locked", module: "Module 3.2", title: "Dijkstra's Algorithm" },
      { day: "Wednesday", status: "locked", module: "Module 3.3", title: "Greedy Strategies" },
      { day: "Thursday", status: "locked", module: "Module 3.4", title: "Minimum Spanning Trees" },
      { day: "Friday", status: "locked", module: "Assessment", title: "Weekly Challenge: Network Cost Optimiser" },
      { day: "Saturday", status: "locked" },
      { day: "Sunday", status: "locked" },
    ],
  },
  {
    week: 4,
    objective: {
      title: "Dynamic Programming & Review",
      text: "By the end of this week, you will recognise overlapping subproblems, build bottom-up solutions, and consolidate the trimester's topics for the final assessment.",
      progress: 0,
    },
    estimatedHours: 14,
    concepts: ["Memoisation", "Tabulation", "Knapsack", "Revision"],
    days: [
      { day: "Monday", status: "locked", module: "Module 4.1", title: "Overlapping Subproblems" },
      { day: "Tuesday", status: "locked", module: "Module 4.2", title: "Tabulation Patterns" },
      { day: "Wednesday", status: "locked", module: "Module 4.3", title: "Knapsack & Sequences" },
      { day: "Thursday", status: "locked", module: "Module 4.4", title: "Trimester Revision" },
      { day: "Friday", status: "locked", module: "Assessment", title: "Final Assessment" },
      { day: "Saturday", status: "locked" },
      { day: "Sunday", status: "locked" },
    ],
  },
];

export const OFFICE_HOURS = { title: "Office Hours Available Today", text: "Stuck on BFS? Prof. Davis has open slots from 3 PM - 5 PM." };

/* ---------- Help Center / inquiries ---------- */
export type TInquiryCategory = "academics" | "technical" | "billing";
export const INQUIRY_CATEGORIES: { key: TInquiryCategory; label: string; text: string }[] = [
  { key: "academics", label: "Academics", text: "Coursework, grades, professors" },
  { key: "technical", label: "Technical", text: "Platform access, bugs, integrations" },
  { key: "billing", label: "Billing", text: "Invoices, payment plans, aid" },
];

export type TInquiry = { id: string; status: "pending" | "resolved"; ago: string; subject: string; category: string };
export const INQUIRIES: TInquiry[] = [
  { id: "i1", status: "pending", ago: "2d ago", subject: "Cannot access Week 3 Module", category: "Technical" },
  { id: "i2", status: "resolved", ago: "1w ago", subject: "Invoice #4402 Correction", category: "Billing" },
  { id: "i3", status: "resolved", ago: "2w ago", subject: "Extension for Assignment 1", category: "Academics" },
];

export const PRIORITY_HOTLINE = "+1 (800) 555-0199";

/* ---------- Coding lab ---------- */
export type TLabFile = { name: string; language: "javascript" | "python" | "json" | "html" | "css"; content: string; readOnly?: boolean };

export const CODE_LAB = {
  id: "graph-representations",
  trimester: "TRIMESTER 2",
  module: "Module 2.2",
  title: "Coding Lab: Graph Representations",
  estimate: "1h",
  steps: [
    "Implement buildAdjacencyList(edges, directed) so it returns an object that maps every node to the list of nodes it connects to.",
    "For undirected graphs, add the edge in both directions. For directed graphs, still create an empty list for nodes that have no outgoing edges.",
    "Implement bfs(graph, start) so it returns the nodes in the order a breadth-first search visits them.",
    "Press Run (or Ctrl/Cmd + Enter) to check your work against the tests.",
  ],
  hints: [
    "Use an array as a queue: push to add, shift to take from the front.",
    "Keep a Set of visited nodes so you never visit a node twice.",
    "Nodes can appear only as the target of an edge, so create their entry too.",
  ],
  files: [
    {
      name: "graph.js",
      language: "javascript",
      content: `// Module 2.2: Graph Representations
// 1) Build an adjacency list from an edge list.
// 2) Implement breadth-first search on it.

function buildAdjacencyList(edges, directed = false) {
  // TODO: return an object like { A: ["B", "C"], B: ["A"], C: ["A"] }
}

function bfs(graph, start) {
  // TODO: return the nodes in the order BFS visits them
}

// Try things out here. console.log output shows in the Console tab.
console.log(buildAdjacencyList([["A", "B"], ["A", "C"]]));
`,
    },
    {
      name: "tests.js",
      language: "javascript",
      readOnly: true,
      content: `// These tests run against your graph.js. You can read them but not edit them.

test("builds an undirected adjacency list", () => {
  assertEqual(buildAdjacencyList([["A", "B"], ["A", "C"]]), { A: ["B", "C"], B: ["A"], C: ["A"] });
});

test("builds a directed adjacency list", () => {
  assertEqual(buildAdjacencyList([["A", "B"]], true), { A: ["B"], B: [] });
});

test("bfs visits nodes level by level", () => {
  const graph = { A: ["B", "C"], B: ["D"], C: ["D"], D: [] };
  assertEqual(bfs(graph, "A"), ["A", "B", "C", "D"]);
});

test("bfs skips unreachable nodes", () => {
  assertEqual(bfs({ A: ["B"], B: [], C: [] }, "A"), ["A", "B"]);
});
`,
    },
  ] as TLabFile[],
};

// Code the instructor is sharing during the live class (shown read-only in the class's Code tab)
export const LIVE_SHARED_CODE = `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const next of graph[node] ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order; // O(V + E)
}`;
