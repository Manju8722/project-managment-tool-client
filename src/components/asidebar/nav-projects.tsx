import {
  ArrowRight,
  Folder,
  Loader,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import { ConfirmDialog } from "../resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Button } from "../ui/button";
import PermissionsGuard from "../resuable/permission-guard";
import { Permissions } from "@/constant";
import { useState } from "react";
import useGetProjectsInWorkSpaceQuery from "@/context/use-get-projects";
import { PaginationType } from "@/types/api.type";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function NavProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const workspaceId = useWorkspaceId();
  const { isMobile } = useSidebar();

  const { onOpen } = useCreateProjectDialog();
  const { context, open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  // getProjectsInWorkspaceQueryFn;
  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();
  const { mutate, isPending: isloading } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { isPending, data, isFetching, isError } =
    useGetProjectsInWorkSpaceQuery({
      workspaceId,
      pageSize,
      pageNumber,
    });
  const projects = data?.projects || [];
  const pagination = data?.pagination || ({} as PaginationType);

  const hasMore = pagination.totalPages > pageNumber;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 5);
  };
  // const projects = [
  //   {
  //     id: "pro-383dh",
  //     name: "Design Engineering",
  //     emoji: "📊",
  //     url: `/workspace/${workspaceId}/project/:pro-383dh`,
  //   },
  //   {
  //     id: "p383dh",
  //     name: "Sales & Marketing",
  //     emoji: "📈",
  //     url: `/workspace/${workspaceId}/project/:p383dh`,
  //   },
  //   {
  //     id: "pro-wwhe",
  //     name: "Travel",
  //     emoji: "✈️",
  //     url: `/workspace/${workspaceId}/project/:pro-wwhe`,
  //   },
  // ];

  // const hasMore = true;

  const handleConfirm = () => {
    if (!context) return;
    mutate(
      {
        projectId: context?._id,
        workspaceId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["allprojects", workspaceId],
          });
          toast({
            title: "Success",
            description: "Deleted project succesfully",
            variant: "success",
          });

          navigate("/workspace/" + workspaceId);
          setTimeout(() => {
            onCloseDialog();
          }, 100);
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        },
      }
    );
  };
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="w-full justify-between pr-0">
          <span>Projects</span>
          <PermissionsGuard requiredPermission={Permissions.CREATE_PROJECT}>
            <button
              onClick={onOpen}
              type="button"
              className="flex size-5 items-center justify-center rounded-full border"
            >
              <Plus className="size-3.5" />
            </button>
          </PermissionsGuard>
        </SidebarGroupLabel>
        <SidebarMenu className="h-[320px] scrollbar overflow-y-auto pb-2">
          {isError ? <div>Error occured</div> : null}
          {isPending && (
            <Loader className="animate-spin w-5 h-5 place-self-center" />
          )}
          {!isPending && projects?.length === 0 ? (
            <div className="pl-3">
              <p className="text-xs text-muted-foreground">
                There is no projects in this Workspace yet. Projects you create
                will show up here.
              </p>
              <Button
                variant="link"
                type="button"
                className="h-0 p-0 text-[13px] underline font-semibold mt-4"
                onClick={onOpen}
              >
                Create a project
                <ArrowRight />
              </Button>
            </div>
          ) : (
            projects.map((item) => {
              const projectUrl =
                "/workspace/" + workspaceId + "/project/" + item._id;

              return (
                <SidebarMenuItem key={item._id}>
                  <SidebarMenuButton asChild isActive={projectUrl === pathname}>
                    <Link to={projectUrl}>
                      {item.emoji}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={() => navigate(`${projectUrl}`)}
                      >
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <PermissionsGuard
                        requiredPermission={Permissions.DELETE_PROJECT}
                      >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={isloading}
                          onClick={() => onOpenDialog(item)}
                        >
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </PermissionsGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-sidebar-foreground/70"
                disabled={isFetching}
                onClick={fetchNextPage}
              >
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>{isFetching ? "loading..." : "More"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <ConfirmDialog
        isOpen={open}
        isLoading={isloading}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete ${
          context?.name || "this item"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
