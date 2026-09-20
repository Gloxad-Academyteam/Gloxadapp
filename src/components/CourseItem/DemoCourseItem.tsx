import CourseBox from "./CourseItemBox";

function DemoCourse() {
  const courses = [
    {
        id: 1,
        title: 'The Complete Javascript Course',
        instructor: 'John Doe',
        rating: 2.5,
        price: 4999,
        imageUrl: 'https://muyanzi-files.s3.amazonaws.com/js-image.jpg',
        studentCount: 12010,
        url: '',
    },
    {
        id:1,
        title: 'Introduction to German Language',
        instructor: 'John Smith',
        rating: 5,
        price: 4999,
        imageUrl: 'https://muyanzi-files.s3.amazonaws.com/german-image.jpg',
        studentCount: 1500,
        url: '',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center">
      {courses.map((course) => (
        <CourseBox course={course} key={course.id} />
      ))}
    </div>
  );
}

export default DemoCourse;

