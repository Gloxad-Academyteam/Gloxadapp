import useSearchResultsPageQuery from "@pages/SearchResultsPage/hooks/useSearchResultsPageQuery";
import { useState } from "react";

const usePaginationNavigator = () => {
  const { handleSetSearchQuery, handleGetSearchQuery } = useSearchResultsPageQuery();
  const [page, setPage] = useState<number>(handleGetSearchQuery("page") as number);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleSetSearchQuery({ key: "page", value: newPage.toString() });
  };

  return { page, setPage, handlePageChange };
};

export default usePaginationNavigator;
