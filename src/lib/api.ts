import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AllWorkspaceResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  EditProjectPayloadType,
  EditWorkspaceType,
  LoginResponseType,
  loginType,
  ProjectByIdPayloadType,
  ProjectResponseType,
  registerType,
  WorkspaceByIdResponseType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: registerType) => {
  return (await API.post("/auth/register", data))?.data;
};

export const logoutMutationFn = async () => {
  return (await API.post("/auth/logout"))?.data;
};

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/auth/current`);
    return response.data;
  };

//********* WORKSPACE ****************
//************* */

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const data = await API.get("/workspace/all");
    return data.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceid: string
): Promise<WorkspaceByIdResponseType> => {
  return (await API.get("/workspace/" + workspaceid)).data;
};

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  return (await API.post("/workspace/create/new", data)).data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  return (await API.put("/workspace/update/" + workspaceId, data)).data;
};
export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  return (await API.delete("/workspace/delete/" + workspaceId)).data;
};
export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  return (await API.get("/workspace/analytics/" + workspaceId)).data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};
export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  return (await API.put("/workspace/change/member/role/" + workspaceId, data))
    .data;
};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  return (await API.post("/member/workspace/" + inviteCode + "/join")).data;
};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  return (await API.post("/project/workspace/" + workspaceId + "/create", data))
    .data;
};
export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  return (
    await API.get(
      "/project/workspace/" +
        workspaceId +
        `/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
    )
  )?.data;
};

export const editProjectMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  return (
    await API.put(
      "/project/" + projectId + "/workspace/" + workspaceId + "/update",
      data
    )
  ).data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  return (await API.get("/project/" + projectId + "/workspace/" + workspaceId))
    ?.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  return (
    await API.get(
      "/project/" + projectId + "/workspace/" + workspaceId + "/analytics"
    )
  ).data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  return await API.delete(
    "/project/" + projectId + "/workspace/" + workspaceId + "/delete"
  );
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  return (
    await API.post(
      "/task/project/" + projectId + "/workspace/" + workspaceId + "/create",
      data
    )
  ).data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};
export const deleteTaskMutationFn = async () => {};
