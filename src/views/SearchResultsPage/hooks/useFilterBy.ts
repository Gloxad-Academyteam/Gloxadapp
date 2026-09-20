import { useState } from "react";
import useSearchResultsPageQuery from "./useSearchResultsPageQuery";

const useFilterBy = () => {
  const { handleSetSearchQuery, handleGetSearchQuery } = useSearchResultsPageQuery();
  const [currentRating, setCurrentRating] = useState<number | null>(handleGetSearchQuery("rating") as number | null);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(handleGetSearchQuery("language") as string | null);

  const handleRatingChange = (rating: number) => {
    setCurrentRating(rating);
    handleSetSearchQuery({ key: "rating", value: rating.toString() });
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    handleSetSearchQuery({ key: "language", value: language });
  }

  const handleClearFilter = () => {
    setCurrentRating(null);
    handleSetSearchQuery({ excludeList: ["rating", "language"] });
  };

  return { handleRatingChange, currentRating, handleClearFilter, handleLanguageChange, currentLanguage };
};

export default useFilterBy;
