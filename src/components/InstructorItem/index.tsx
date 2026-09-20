import { FaStar, FaAward, FaPlayCircle } from 'react-icons/fa';
import { MdPeopleAlt } from 'react-icons/md';

type TInstructorItem = {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  students: number;
  courses: number;
  description: string;
  avatarUrl: string;
}

type TInstructorItemProps = {
  instructor: TInstructorItem;
}

const InstructorItem = ({ instructor }: TInstructorItemProps) => {
  return (
    <div className="bg-primary-1 shadow-lg rounded-lg p-6 w-96 border border-neutral-11">
      <div className="text-left mb-4">
        <h3 className="text-title-medium font-bold text-neutral-11">Instructor</h3>
      </div>
      <div className="text-left mb-4">
        <h2 className="text-title-large font-bold text-primary-source mb-2">{instructor.name}</h2>
        <p className="text-neutral-13">{instructor.title}</p>
      </div>
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0">
          <img src={instructor.avatarUrl} alt={`${instructor.name}'s picture`} className="w-32 h-32 rounded-full" />
        </div>
        <div className="ml-4 space-y-2">
          <p className="flex items-center text-neutral-11">
            <FaStar className="mr-2" />
            {instructor.rating} Instructor Rating
          </p>
          <p className="flex items-center text-neutral-11">
            <FaAward className="mr-2" />
            {instructor.reviews.toLocaleString()} Reviews
          </p>
          <p className="flex items-center text-neutral-11">
            <MdPeopleAlt className="mr-2" />
            {instructor.students.toLocaleString()} Students
          </p>
          <p className="flex items-center text-neutral-11">
            <FaPlayCircle className="mr-2" />
            {instructor.courses} Courses
          </p>
        </div>
      </div>
      <p className="text-neutral-11 leading-normal">{instructor.description}</p>
    </div>
  );
};

export default InstructorItem;
