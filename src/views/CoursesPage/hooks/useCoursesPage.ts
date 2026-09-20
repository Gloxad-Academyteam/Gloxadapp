import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@utils/axiosInstance";

export const useCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);

  const { data: courses, isLoading: isLoadingCourses, error } = useQuery({
    queryKey: ["courses", searchQuery, subjects, languages, products, levels, durations],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/courses", {
          params: {
            search: searchQuery || undefined,
            subjects: subjects.length ? subjects.join(",") : undefined,
            languages: languages.length ? languages.join(",") : undefined,
            products: products.length ? products.join(",") : undefined,
            levels: levels.length ? levels.join(",") : undefined,
            durations: durations.length ? durations.join(",") : undefined,
          }
        });
        
        // Handle different possible backend response structures
        return data.courses || data.data || data || [];
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        return [];
      }
    },
  });

  return {
    searchQuery, setSearchQuery,
    subjects, setSubjects,
    languages, setLanguages,
    products, setProducts,
    levels, setLevels,
    durations, setDurations,
    courses: courses || [],
    isLoading: isLoadingCourses,
    error,
  };
};
