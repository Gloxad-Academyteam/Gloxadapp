import { BlockSkeleton, CardGridSkeleton, DetailSkeleton, ListSkeleton, Skeleton, TableRowsSkeleton } from "@components/Skeleton";
import CourseBox from "@components/CourseItem/CourseItemBox";
import ScrollReveal from "@components/ScrollReveal";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@utils/axiosInstance";
import useAuth from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "@components/Button";
import { motion } from "framer-motion";
import { getYouTubeSourceName, isCourseVisible, isFreeYouTubeCourse } from "@utils/courseSource";

const PopularCourses = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["popular-courses"],
    queryFn: async () => {
      const res = await axiosInstance.get("/courses?sort=popular&limit=6");
      return res.data;
    },
  });

  const courses = (data?.courses || []).filter(isCourseVisible);
  const totalCourses = data?.totalCourses || 0;

  const handleViewMore = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/courses");
    } else {
      navigate("/courses");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 py-12"><CardGridSkeleton count={3} className="mx-auto grid max-w-[1200px] gap-5 sm:grid-cols-2 lg:grid-cols-3" /></div>
    );
  }

  return (
    <section className="flex flex-col gap-[40px] items-center">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="font-bold text-headline-large text-neutral-11">
            Popular Courses
          </h2>
          <p className="text-body-large text-neutral-7 mt-2">
            Learn from the best — courses loved by thousands of students
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full">
        {Array.isArray(courses) && courses.map((course: any, index: number) => {
          const frontendCourse = {
            id: course._id,
            title: course.title,
            instructor: isFreeYouTubeCourse(course) ? getYouTubeSourceName(course) : course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "Gloxad Academy",
            isYouTubeFree: isFreeYouTubeCourse(course),
            rating: course.averageRating ?? 0,
            price: course.price,
            imageUrl: course.thumbnailUrl || "https://via.placeholder.com/400x230",
            studentCount: course.enrollmentCount || 0,
            url: `/courses/${course.slug}`,
            level: course.level,
            duration: course.duration,
            skills: course.skills,
          };
          const cardVariants: any = {
            hidden: { 
              opacity: 0, 
              x: 200, 
              y: -150, 
              rotateZ: 15,
              scale: 0.8
            },
            visible: { 
              opacity: 1, 
              x: 0, 
              y: 0, 
              rotateZ: 0,
              scale: 1,
              transition: { 
                type: "spring",
                damping: 20,
                stiffness: 100,
                mass: 1,
                delay: index * 0.15 
              } 
            }
          };

          return (
            <motion.div 
              key={course._id} 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <CourseBox course={frontendCourse} />
            </motion.div>
          );
        })}
      </div>

      {totalCourses > 6 && (
        <ScrollReveal>
          <div className="mt-4">
            <Button
              text="View More Courses"
              onClick={handleViewMore}
            />
          </div>
        </ScrollReveal>
      )}
    </section>
  );
};

export default PopularCourses;
