import Link from 'next/link';
import formatToCurrency from '@utils/formatToCurrency';
import Stars from '@components/Stars/Stars';
import { FaGraduationCap } from 'react-icons/fa';

export type TCourse = {
  id: string | number;
  title: string;
  instructor: string;
  rating: number;
  price: number;
  imageUrl: string;
  studentCount: number;
  url: string;
  discountedPrice?: number;
  skills?: string;
  level?: string;
  duration?: string;
}

type TCourseBoxProps = {
  course: TCourse;
  isEnrolled?: boolean;
}

import { motion } from 'framer-motion';

const CourseBox = ({ course, isEnrolled }: TCourseBoxProps ) => {
  return (
    <Link href={course.url} className="block w-full h-full">
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-full bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border-[1px] border-neutral-3 hover:border-primary-4/50 flex flex-col overflow-hidden relative group transition-colors duration-300"
      >
        
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-[180px] object-cover border-b border-neutral-3 group-hover:scale-105 transition-transform duration-500"
          />
          {isEnrolled && (
            <div className="absolute top-3 left-3 bg-success-5 text-white px-3 py-1 rounded-[4px] text-xs font-bold shadow-sm z-10 flex items-center gap-1">
              ✓ Enrolled
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-[4px] text-xs font-bold text-neutral-10 shadow-sm animate-shimmer">
            Premium
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Provider/Instructor */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-sm bg-neutral-2 flex items-center justify-center border border-neutral-4">
              <FaGraduationCap className="text-primary-6 text-[10px]" />
            </div>
            <span className="text-xs font-medium text-neutral-8">{course.instructor}</span>
          </div>

          {/* Title */}
          <h2 className="font-bold text-title-medium text-neutral-11 leading-snug mb-2 line-clamp-2 group-hover:text-primary-6 transition-colors">
            {course.title}
          </h2>

          {/* Skills */}
          <p className="text-xs text-neutral-8 mb-4 line-clamp-2 leading-relaxed">
            <span className="font-bold text-neutral-10">Skills you'll gain: </span>
            {course.skills || "Web Development, UI/UX Design, Data Analysis, Artificial Intelligence, Problem Solving"}
          </p>

          {/* Spacer to push bottom section down */}
          <div className="mt-auto"></div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2 mt-2">
            <span className="font-bold text-secondary-6 text-sm">
              {course.rating.toFixed(1)}
            </span>
            <Stars rating={course.rating} />
            <span className="text-xs text-neutral-7">
              ({(course.studentCount || 1250).toLocaleString()} reviews)
            </span>
          </div>

          {/* Level & Duration */}
          <div className="text-xs text-neutral-7 mb-4">
            {course.level || "Beginner"} · Course · {course.duration || "1 - 3 Months"}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between border-t border-neutral-3 pt-3">
            <div className="flex flex-col">
              <p className="font-bold text-title-medium text-neutral-11">
                {formatToCurrency(course.discountedPrice || course.price)}
              </p>
            </div>
            <div className={`px-5 py-2 text-sm font-bold rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${isEnrolled ? 'bg-success-5 text-white hover:bg-success-6 hover:shadow-success-5/30' : 'bg-primary-6 text-white hover:bg-primary-7 hover:shadow-primary-6/30'}`}>
              {isEnrolled ? "Go to Course" : "View Details"}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseBox;
