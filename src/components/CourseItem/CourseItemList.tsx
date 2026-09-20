import Link from 'next/link';
import Stars from '@components/Stars/Stars';
import ImageComponent from '@components/ImageComponent/ImageComponent';

type TCourse = {
  id: string | number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  ratingCount: number;
  totalHours: number;
  totalLectures: number;
  level: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  url: string;
}

type TCourseBoxProps = {
  course: TCourse;
  isEnrolled?: boolean;
}

const CourseList = ({ course, isEnrolled }: TCourseBoxProps) => {
  return (
    <div className="flex w-full p-4 bg-white rounded-lg shadow-md border-[1px] border-neutral-4 relative">
      <div className="relative">
        <ImageComponent
          src={course.imageUrl}
          alt={course.title}
          width="250px"
          height="170px"
        />
        {isEnrolled && (
          <div className="absolute top-2 left-2 bg-success-5 text-white px-2 py-1 rounded text-xs font-bold shadow-sm z-10 flex items-center gap-1">
            ✓ Enrolled
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between w-full pl-4">
        <div className="flex items-center justify-between h-[100%] gap-4">
          <div className="flex flex-col justify-between h-[100%] gap-2">
          <h1 className="font-bold leading-tight tracking-wide text-title-large"><Link href={course.url}>{course.title}</Link></h1>
            <p className="flex-1 text-gray-600 text-body-large">
              {course.description}
            </p>
            <p className="font-medium text-gray-800 text-body-medium">
              {course.instructor}
            </p>
            <div className="flex items-center my-1">
              <span className="text-sm font-bold text-gray-600">{course.rating.toFixed(1)}</span>
              <div className="flex items-center ml-1">
                <Stars rating={course.rating} />
              </div>
              <span className="ml-2 text-sm text-gray-600">({course.ratingCount.toLocaleString()})</span>
            </div>
            <div className="flex text-gray-600 text-body-medium space-x-2">
              <span>{course.totalHours} total hours</span>
              <span>&#8226;</span>
              <span>{course.totalLectures} total lectures</span>
              <span>&#8226;</span>
              <span>{course.level}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <span className="block text-lg font-bold text-red-600">&#8358;{course.discountedPrice.toLocaleString()}</span>
              <span className="text-gray-500 line-through text-body-medium">&#8358;{course.originalPrice.toLocaleString()}</span>
            </div>
            <div className={`px-6 py-2.5 text-sm font-bold rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg mt-auto ${isEnrolled ? 'bg-success-5 text-white hover:bg-success-6 hover:shadow-success-5/30' : 'bg-primary-6 text-white hover:bg-primary-7 hover:shadow-primary-6/30'}`}>
              {isEnrolled ? "Go to Course" : "View Details"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
