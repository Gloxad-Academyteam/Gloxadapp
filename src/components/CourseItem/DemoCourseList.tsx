import React from "react";
import CourseList from "./CourseItemList";

const courses = [
  {
    id: 1,
    title: "The Complete Javascript Course",
    description:
      "Javascript course designed to equip learners with the foundational and advanced skills needed for JavaScript proficiency.",
    instructor: "John Doe",
    rating: 5.0,
    ratingCount: 12010,
    totalHours: 90,
    totalLectures: 40,
    level: "All Levels",
    originalPrice: 7999,
    discountedPrice: 4999,
    imageUrl: "https://muyanzi-files.s3.amazonaws.com/js-image.jpg",
    url: "",
  },
  {
    id: 2,
    title: "Introduction to German Language",
    description:
      "Dive in and learn German from scratch! Learn alphabets, pronunciation, sentence composition and way more!",
    instructor: "Jane Smith",
    rating: 4.8,
    ratingCount: 10234,
    totalHours: 60,
    totalLectures: 30,
    level: "Intermediate",
    originalPrice: 8999,
    discountedPrice: 5499,
    imageUrl: "https://muyanzi-files.s3.amazonaws.com/german-image.jpg",
    url: "",
  },
];

const DemoCourseList: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {courses.map((course) => (
        <CourseList key={course.id} course={course} />
      ))}
    </div>
  );
};

export default DemoCourseList;
