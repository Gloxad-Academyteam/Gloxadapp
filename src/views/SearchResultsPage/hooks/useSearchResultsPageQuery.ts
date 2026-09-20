"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type TKey = "search" | "page" | "rating" | "language";

const useSearchResultsPageQuery = () => {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams() ?? new URLSearchParams();

  const handleSetSearchQuery = ({
    key,
    value,
    excludeList,
  }: {
    key?: TKey;
    value?: string;
    excludeList?: TKey[];
  } = {}) => {
    const allQueries: Record<string, string> = {
      search: searchParams.get("search") || "",
      page: searchParams.get("page") || "1",
      rating: searchParams.get("rating") || "",
      language: searchParams.get("language") || "",
    };

    if (key && value) {
      allQueries[key] = value;
    }

    if (excludeList) {
      excludeList.forEach((excludeKey) => {
        delete allQueries[excludeKey];
      });
    }

    const nextParams = new URLSearchParams();
    Object.entries(allQueries).forEach(([queryKey, queryValue]) => {
      if (queryValue) nextParams.set(queryKey, queryValue);
    });

    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const handleGetSearchQuery = (key: TKey) => {
    if (key === "page") {
      return parseInt(searchParams.get(key) || "1", 10);
    }

    if (key === "rating") {
      return searchParams.get(key)
        ? parseInt(searchParams.get(key) as string, 10)
        : null;
    }

    if (key === "search") {
      return searchParams.get(key) || "";
    }

    if (key === "language") {
      return searchParams.get(key) || "";
    }
  };

  return { handleSetSearchQuery, handleGetSearchQuery };
};

export default useSearchResultsPageQuery;
