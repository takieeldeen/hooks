import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<T extends { name: string; page: number }> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { name: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.name);
  useEffect(() => {
    if (localSearch === "" && params.name !== "") {
      setParams({
        ...params,
        name: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }
    const timeout = setTimeout(() => {
      if (localSearch !== params.name) {
        setParams({
          ...params,
          name: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);
    return () => clearTimeout(timeout);
  }, [debounceMs, localSearch, params, setParams]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(params.name);
  }, [params.name]);
  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
