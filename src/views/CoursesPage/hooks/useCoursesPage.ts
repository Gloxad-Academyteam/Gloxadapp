import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@utils/axiosInstance";
import { searchCatalog } from "@services/catalog";

export const useCoursesPage = () => {
  const searchParams = useSearchParams();
  // Links across the site (home page tabs, free courses) filter with ?search= and ?category=
  const urlSearch = searchParams?.get("search") ?? "";
  const category = searchParams?.get("category") ?? "";

  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);

  // A new ?search= link (e.g. from the home page) replaces whatever was typed
  useEffect(() => setSearchQuery(urlSearch), [urlSearch]);

  const search = searchQuery.trim();

  const { data: apiCourses, isLoading: isLoadingCourses, error } = useQuery({
    queryKey: ["courses", search, category, subjects, languages, products, levels, durations],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/courses", {
          params: {
            search: search ? search.replace(/-/g, " ") : undefined,
            category: category || undefined,
            subjects: subjects.length ? subjects.join(",") : undefined,
            languages: languages.length ? languages.join(",") : undefined,
            products: products.length ? products.join(",") : undefined,
            levels: levels.length ? levels.join(",") : undefined,
            durations: durations.length ? durations.join(",") : undefined,
          }
        });

        // Handle different possible backend response structures
        const list = data.courses || data.data || data || [];
        return Array.isArray(list) ? list : [];
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        return [];
      }
    },
  });

  // Database courses first; catalog courses fill in any title the database doesn't have yet
  const fromApi = apiCourses || [];
  const apiTitles = new Set(fromApi.map((course: any) => String(course.title).toLowerCase()));
  const fromCatalog = searchCatalog({ search, category }).filter(
    (course) => !apiTitles.has(course.title.toLowerCase())
  );

  return {
    searchQuery, setSearchQuery,
    subjects, setSubjects,
    languages, setLanguages,
    products, setProducts,
    levels, setLevels,
    durations, setDurations,
    category,
    search,
    courses: [...fromApi, ...fromCatalog],
    isLoading: isLoadingCourses,
    error,
  };
};
