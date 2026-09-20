type TCourseItem = {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  price: number;
  imageUrl: string;
  studentCount: number;
  discountedPrice: number;
};


type TUISearchCourseItem = TCourseItem & {
  description: string;
  ratingCount: number;
  totalHours: number;
  totalLectures: number;
  level: string;
};


export type { TCourseItem, TUISearchCourseItem };
