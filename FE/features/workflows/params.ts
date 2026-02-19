import { PAGINATION } from "@/config/constants";
import { parseAsString, parseAsInteger, createLoader } from "nuqs/server";

export const workflowsParams = {
  name: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({
      clearOnDefault: true,
    }),
};

export const loadSearchParams = createLoader(workflowsParams);
