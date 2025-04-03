import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { AllProjectPayloadType } from "@/types/api.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useGetProjectsInWorkSpaceQuery = ({
  workspaceId,
  pageNumber,
  pageSize,
  skip = false,
}: AllProjectPayloadType) => {
  return useQuery({
    queryKey: ["allprojects", workspaceId, pageNumber, pageSize],
    queryFn: () =>
      getProjectsInWorkspaceQueryFn({
        workspaceId,
        pageNumber,
        pageSize,
        skip,
      }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });
};

export default useGetProjectsInWorkSpaceQuery;
