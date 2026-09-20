import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import TService from "@types_/service";

type TFetchState<TData> = {
  data: TData | null;
  loading: boolean;
  error: string | null;
};

function useFetch<TData>() {
  const [fetchState, setFetchState] = useState<TFetchState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const handleFetch = useCallback(
    async (service: () => Promise<TService<TData>>) => {
      try {
        setFetchState({
          data: null,
          loading: true,
          error: null,
        });

        const response = await service();
        setFetchState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message ?? err.message;

        setFetchState({
          data: null,
          loading: false,
          error: message,
        });
      }
    },
    []
  );

  return {
    fetchState,
    handleFetch,
  };
}

export default useFetch;


