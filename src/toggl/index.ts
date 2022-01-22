import { Client, Project, Tag, TimeEntry, Workspace } from "./types";
import { getPreferenceValues } from "@raycast/api";
import { authenticatedFetch } from "./auth";

const TogglAPI = function (apiToken: string) {
  const baseUrl = "https://api.track.toggl.com/api/v8";
  const api = authenticatedFetch(apiToken, baseUrl);

  return {
    getWorkspaces: (): Promise<Workspace[]> => {
      return api.get<Workspace[]>("/workspaces");
    },
    getWorkspaceProjects: (workspaceId: number): Promise<Project[] | null> => {
      return api.get<Project[] | null>(`/workspaces/${workspaceId}/projects`);
    },
    createTimeEntry: ({ projectId, description, tags }: { projectId: number; description: string; tags: string[] }) => {
      return api.post<{ data: TimeEntry }>(`/time_entries/start`, {
        time_entry: {
          description,
          pid: projectId,
          tags,
          created_with: "raycast-toggl-track",
        },
      });
    },
    getRunningTimeEntry: async (): Promise<TimeEntry | null> => {
      const { data } = await api.get<{ data: TimeEntry }>("/time_entries/current");
      return data;
    },
    getWorkspaceClients: (workspaceId: number): Promise<Client[] | null> => {
      return api.get<Client[] | null>(`/workspaces/${workspaceId}/clients`);
    },
    getWorkspaceTags: (workspaceId: number): Promise<Tag[] | null> => {
      return api.get<Tag[] | null>(`/workspaces/${workspaceId}/tags`);
    },
    stopTimeEntry: ({ id }: { id: number }) => {
      return api.put<{ data: TimeEntry }>(`/time_entries/${id}/stop`, {});
    },
  };
};

interface Preferences {
  togglApiToken: string;
}

const preferences: Preferences = getPreferenceValues();
const toggl = TogglAPI(preferences.togglApiToken);

export default toggl;
