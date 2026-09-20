// Mock data for landing page sections while backend is under construction

export const mockCategories = [
  { id: 1, name: "Web Development", slug: "web-development", icon: "💻", courseCount: 120 },
  { id: 2, name: "Data Science", slug: "data-science", icon: "📊", courseCount: 85 },
  { id: 3, name: "UI/UX Design", slug: "ui-ux-design", icon: "🎨", courseCount: 64 },
  { id: 4, name: "Digital Marketing", slug: "digital-marketing", icon: "📱", courseCount: 92 },
  { id: 5, name: "Business", slug: "business", icon: "💼", courseCount: 73 },
  { id: 6, name: "Photography", slug: "photography", icon: "📸", courseCount: 45 },
  { id: 7, name: "Music", slug: "music", icon: "🎵", courseCount: 38 },
  { id: 8, name: "Health & Fitness", slug: "health-fitness", icon: "🏋️", courseCount: 56 },
];

export const mockCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    price: 89.99,
    discountedPrice: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    studentCount: 234500,
    url: "/courses/1",
  },
  {
    id: 2,
    title: "Python for Data Science & ML",
    instructor: "Jose Portilla",
    rating: 4.6,
    price: 94.99,
    discountedPrice: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
    studentCount: 189200,
    url: "/courses/2",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    instructor: "Daniel Walter Scott",
    rating: 4.8,
    price: 79.99,
    discountedPrice: 11.99,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    studentCount: 67800,
    url: "/courses/3",
  },
  {
    id: 4,
    title: "Digital Marketing A-Z",
    instructor: "Udemy Instructor",
    rating: 4.5,
    price: 84.99,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    studentCount: 145300,
    url: "/courses/4",
  },
  {
    id: 5,
    title: "React & Next.js - The Complete Guide",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.9,
    price: 99.99,
    discountedPrice: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    studentCount: 312400,
    url: "/courses/5",
  },
  {
    id: 6,
    title: "Photography Masterclass",
    instructor: "Phil Ebiner",
    rating: 4.4,
    price: 69.99,
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop",
    studentCount: 98700,
    url: "/courses/6",
  },
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Web Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content: "Gloxad Academy completely transformed my career. The courses are well-structured and the instructors are top-notch. I went from knowing nothing about coding to landing my dream job in just 6 months!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "The data science courses here are incredibly comprehensive. The practical projects helped me build a portfolio that impressed my employers. Highly recommended for anyone looking to break into tech.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amara Okafor",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "As a self-taught designer, Gloxad Academy filled all the gaps in my knowledge. The design courses are modern, relevant, and taught by professionals who actually work in the industry.",
    rating: 4,
  },
  {
    id: 4,
    name: "David Martinez",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "The business and marketing courses gave me the skills I needed to launch my own startup. The content is practical and actionable — not just theory. Worth every penny!",
    rating: 5,
  },
];

export const mockStats = [
  { label: "Students", value: 10000, suffix: "+" },
  { label: "Courses", value: 500, suffix: "+" },
  { label: "Expert Tutors", value: 200, suffix: "+" },
  { label: "Countries", value: 50, suffix: "+" },
];

export const mockFAQs = [
  {
    question: "How do I get started with Gloxad Academy?",
    answer: "Simply create a free account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately after enrollment.",
  },
  {
    question: "Are the courses self-paced?",
    answer: "Yes! All courses on Gloxad Academy are self-paced. You can learn at your own speed, pause and resume anytime, and access course materials indefinitely after enrollment.",
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer: "Absolutely! Upon successful completion of any course, you'll receive a verified certificate that you can share on LinkedIn or add to your resume.",
  },
  {
    question: "Can I become an instructor on Gloxad Academy?",
    answer: "Yes! We welcome experts from all fields. Click on 'Become a Tutor' to submit your course proposal. Our team will review it and get back to you within 48 hours.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit/debit cards, PayPal, bank transfers, and mobile money. We also offer flexible payment plans for premium courses.",
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 30-day money-back guarantee on all courses. If you're not satisfied with a course, you can request a full refund within 30 days of purchase.",
  },
];
