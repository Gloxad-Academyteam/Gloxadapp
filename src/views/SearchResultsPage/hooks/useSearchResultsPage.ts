"use client";

import { getSearchResults } from "@services/courses";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const useSearchResultsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams() ?? new URLSearchParams();

  const handleSetSearchQuery = useCallback(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  useLayoutEffect(() => {
    handleSetSearchQuery();
  }, [handleSetSearchQuery]);

  const pageQuery = useMemo(
    () => searchParams.get("page") || "1",
    [searchParams]
  );
  const ratingQuery = useMemo(
    () => searchParams.get("rating") || undefined,
    [searchParams]
  );
  const languageQuery = useMemo(
    () => searchParams.get("language") || undefined,
    [searchParams]
  );

  const results = useQuery({
    queryKey: ["search", searchQuery, pageQuery, ratingQuery, languageQuery],
    queryFn: () =>
      getSearchResults({
        search: searchQuery,
        page: pageQuery,
        rating: ratingQuery,
        language: languageQuery,
      }),
    enabled: searchQuery !== "",
  });

  const errorMessage = (() => {
    if (!results.error) return "";

    const err = results.error as AxiosError;

    if (!err.response) return err.message;

    return (
      err.response as {
        data: { message: string };
      }
    ).data.message;
  })();

  return {
    searchQuery,
    courses: results.data?.data.courses,
    totalPages: results.data?.data.totalPages,
    isLoading: results.isLoading,
    isError: results.isError,
    error: errorMessage,
  };
};
export default useSearchResultsPage;
