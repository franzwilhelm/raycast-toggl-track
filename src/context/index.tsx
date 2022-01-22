import React, { useEffect, useState } from "react";
import { getStorage, StorageValues } from "../storage";
import useCurrentTime from "../hooks/useCurrentTime";
import { generateProjectGroups, ProjectGroup } from "./ProjectGroup";

interface AppContextProps extends StorageValues {
  projectGroups: ProjectGroup[];
  isLoading: boolean;
}

const initialStorageValues: StorageValues = Object.freeze({
  clients: [],
  projects: [],
  tags: [],
  workspaces: [],
  runningTimeEntry: null,
});

const AppContext = React.createContext<AppContextProps>({
  ...initialStorageValues,
  projectGroups: [],
  isLoading: true,
});

export const AppContextProvider = ({ children }: { children: JSX.Element }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedStorage, setLoadedStorage] = useState<StorageValues>(initialStorageValues);
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const currentTime = useCurrentTime();

  useEffect(() => {
    const load = async () => {
      const storage = await getStorage();
      setLoadedStorage(storage);

      const projectGroups = generateProjectGroups(storage.projects, storage.workspaces, storage.clients);
      setProjectGroups(projectGroups);
      setIsLoading(false);
    };
    load();
  }, [currentTime]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        ...loadedStorage,
        projectGroups,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return React.useContext(AppContext);
};
