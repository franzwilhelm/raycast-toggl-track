import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { AppContextProvider, useAppContext } from "./context";
import RunningTimeEntry from "./components/RunningTimeEntry";
import ProjectGroupSection from "./components/ProjectGroupSection";
import { List } from "@raycast/api";

dayjs.extend(duration);

function ListView() {
  const { isLoading, projectGroups, runningTimeEntry } = useAppContext();

  return (
    <List isLoading={isLoading}>
      {runningTimeEntry && <RunningTimeEntry runningTimeEntry={runningTimeEntry} />}
      {projectGroups && projectGroups.map((group) => <ProjectGroupSection key={group.key} group={group} />)}
    </List>
  );
}

export default function Command() {
  return (
    <AppContextProvider>
      <ListView />
    </AppContextProvider>
  );
}
