import React from 'react';
import InstructorItem from '.';

const DemoInstructorItem: React.FC = () => {
  const instructors = [
    {
      id: 1,
      name: 'John Doe',
      title: 'Web Developer, Designer, and Teacher',
      rating: 4.7,
      reviews: 432456,
      students: 500000,
      courses: 7,
      description: 'Hi, I\'m John Doe. I\'m a full-stack web developer and designer with a passion for building beautiful web interfaces from scratch. I\'ve been building websites and apps since 2010 and also have a Master\'s degree in Engineering.',
      avatarUrl: 'https://xsgames.co/randomusers/avatar.php?g=male'
    },
    {
      id: 2,
      name: 'Jane Smith',
      title: 'Data Scientist and AI Expert',
      rating: 4.9,
      reviews: 123456,
      students: 200000,
      courses: 5,
      description: 'I\'m Jane Smith, a data scientist with over 10 years of experience in machine learning and artificial intelligence. I love sharing my knowledge and helping others to understand the complex world of data science.',
      avatarUrl: 'https://xsgames.co/randomusers/avatar.php?g=female'
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {instructors.map((instructor) => (
        <InstructorItem instructor={instructor} key={instructor.id} />
      ))}
    </div>
  );
}

export default DemoInstructorItem;
