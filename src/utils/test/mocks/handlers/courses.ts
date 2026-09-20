export type TServerSearchCourseItem = {
  id: number;
  title: string;
  imageUrl: string;
  instructor: string;
  rating: number;
  price: number;
  studentCount: number;
  description: string;
  ratingCount: number;
  totalHours: number;
  totalLectures: number;
  level: string;
  discountedPrice?: number;
};
