import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { CustomError } from "@/types/custom-error.type";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery<any, CustomError>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
  });
};

export default useGetWorkspaceQuery;
