import { getMembersInWorkspaceQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

function useGetWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["member", workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn(workspaceId),
    staleTime: Infinity,
  });
}

export default useGetWorkspaceMembers;
