import { List, Icon, ActionPanel, PushAction } from "@raycast/api";
import { Project } from "../toggl/types";
import CreateTimeEntryForm from "./CreateTimeEntryForm";
import { AppContextProvider } from "../context";
import { ProjectGroup } from "../context/ProjectGroup";

function ProjectListItem({ project }: { project: Project }) {
  return (
    <List.Item
      icon={{ source: Icon.Circle, tintColor: project.hex_color }}
      title={project.name}
      actions={
        <ActionPanel>
          <PushAction
            title="Create time entry"
            target={
              <AppContextProvider>
                <CreateTimeEntryForm project={project} />
              </AppContextProvider>
            }
          />
        </ActionPanel>
      }
    />
  );
}

export default function ProjectGroupSection({ group }: { group: ProjectGroup }) {
  return (
    <List.Section title={group.workspace.name} subtitle={group.client?.name}>
      {group.projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </List.Section>
  );
}
