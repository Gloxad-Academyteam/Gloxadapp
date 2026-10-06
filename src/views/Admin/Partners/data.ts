export type TApplicationStatus = "pending" | "under_review" | "approved" | "rejected";
export type TPlanName = "Premium" | "Enterprise";

export type TApplication = {
  id: string;
  institution: string;
  email: string;
  website: string;
  type: string;
  address: string;
  representative: { name: string; role: string; email: string; phone: string };
  students: number;
  expectedStudents: string;
  submittedAt: string; // ISO date
  status: TApplicationStatus;
  plan: TPlanName;
  features: string;
  message: string;
  documents: { name: string; size: string }[];
  notes: string;
  updatedBy: string;
  updatedAt: string;
};

export const STATUS_LABELS: Record<TApplicationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

export const PLAN_OPTIONS: TPlanName[] = ["Premium", "Enterprise"];

const DEFAULT_FEATURES = "Student portal, automated grading system, multi-campus management and parent notification API integration.";

type TSeed = [
  id: string,
  institution: string,
  email: string,
  rep: string,
  role: string,
  type: string,
  students: number,
  date: string,
  status: TApplicationStatus,
  address: string,
];

const SEEDS: TSeed[] = [
  ["APP-992-001", "Beacon University", "admin@beaconheights.edu", "Dr. Helena Marcus", "Provost", "Private University", 12400, "2023-10-10", "pending", "1 Beacon Heights, Boston, MA, USA"],
  ["APP-992-002", "Global Tech Institute", "contact@globaltech.org", "Marcus Vane", "Head of Operations", "Vocational School", 3200, "2023-10-10", "under_review", "88 Innovation Drive, Singapore"],
  ["APP-992-003", "Summit Charter School", "admissions@summit.edu", "Sarah Jenkins", "Admissions Director", "Charter School", 850, "2023-10-10", "approved", "400 Summit Ave, Denver, CO, USA"],
  ["APP-992-004", "Lakeside Medical Academy", "info@lakesidemed.com", "James Wilson", "Registrar", "Medical Institute", 2100, "2023-10-09", "rejected", "12 Lakeside Road, Toronto, Canada"],
  ["APP-992-005", "Oakridge College", "admin@oakridge.cc", "Linda Torres", "Dean of Students", "Public College", 8900, "2023-10-09", "pending", "250 Oakridge Blvd, Austin, TX, USA"],
  ["APP-992-023", "St. Andrews Polytechnic", "info@standrews-poly.edu.ng", "Dr. Samuel Adebayo", "Director of Admissions", "Tertiary Institution", 3800, "2023-10-14", "under_review", "42 Victoria Way, Lagos"],
  ["APP-992-024", "Heritage International School", "registrar@heritage-intl.org", "Amara Okoye", "Principal", "International School", 1150, "2023-10-15", "pending", "7 Heritage Close, Abuja"],
  ["APP-992-025", "Northfield Technical College", "office@northfield.ac.uk", "Priya Raman", "Academic Registrar", "Technical College", 4750, "2023-10-12", "pending", "19 Mill Lane, Manchester, UK"],
  ["APP-992-026", "Riverbend Business School", "hello@riverbend.edu", "David Lindqvist", "Dean", "Business School", 1900, "2023-10-08", "approved", "5 Riverbend Plaza, Stockholm, Sweden"],
  ["APP-992-027", "Sunrise Language Academy", "team@sunriselang.ae", "Fatima Al-Sayed", "Founder", "Language Academy", 640, "2023-10-07", "approved", "Block C, Knowledge Park, Dubai"],
  ["APP-992-028", "Crescent Arts Institute", "studio@crescentarts.in", "Tomás Herrera", "Programme Lead", "Arts Institute", 1320, "2023-10-06", "under_review", "31 Crescent Street, Mumbai, India"],
  ["APP-992-029", "Pinnacle Online University", "admin@pinnacle.online", "Grace Mwangi", "Vice Chancellor", "Online University", 15200, "2023-10-05", "pending", "Westlands Business Park, Nairobi"],
  ["APP-992-030", "Meridian Law School", "admissions@meridianlaw.edu", "Anthony Cole", "Dean of Admissions", "Law School", 980, "2023-10-04", "rejected", "60 Chancery Row, London, UK"],
  ["APP-992-031", "Harborview Nursing College", "contact@harborview.jp", "Yuki Tanaka", "Head of Programmes", "Nursing College", 1760, "2023-10-02", "approved", "2-8 Harborview, Yokohama, Japan"],
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");

const build = ([id, institution, email, rep, role, type, students, date, status, address]: TSeed): TApplication => {
  const domain = email.split("@")[1];
  const isSt = id === "APP-992-023";
  return {
    id,
    institution,
    email,
    website: `www.${domain}`,
    type,
    address,
    representative: {
      name: rep,
      role,
      email: isSt ? "s.adebayo@standrews.edu" : `${slug(rep).slice(0, 12)}@${domain}`,
      phone: isSt ? "+234 801 234 5678" : "+1 555 010 " + String(1000 + Number(id.slice(-3))),
    },
    students,
    expectedStudents: isSt ? "2,500 - 5,000" : `${Math.round(students * 0.8).toLocaleString("en-US")} - ${Math.round(students * 1.25).toLocaleString("en-US")}`,
    submittedAt: date,
    status,
    plan: students > 5000 ? "Enterprise" : "Premium",
    features: isSt ? "Student portal, automated grading system, multi-campus management, parent notification API integration, and digital ID card generation." : DEFAULT_FEATURES,
    message: isSt
      ? "We are looking to digitize our entire examination and admission workflow for the upcoming semester. Our current manual process is causing significant delays."
      : `We would like to move ${institution} onto a single platform for admissions, coursework and reporting before the next intake.`,
    documents: [
      { name: isSt ? "CAC_Registration_Certificate.pdf" : "Registration_Certificate.pdf", size: "2.4MB" },
      { name: isSt ? "NUC_Accreditation_Proof.pdf" : "Accreditation_Proof.pdf", size: "1.8MB" },
    ],
    notes: "",
    updatedBy: isSt ? "Admin_Reviewer_2" : "Admin_Reviewer_1",
    updatedAt: isSt ? "Oct 16, 11:45 AM" : "Oct 12, 09:30 AM",
  };
};

export const SEED_APPLICATIONS: TApplication[] = SEEDS.map(build);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatCount = (value: number) => value.toLocaleString("en-US");
