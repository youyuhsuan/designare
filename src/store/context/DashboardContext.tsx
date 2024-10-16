import { createContext, ReactNode, useContext } from "react";

interface RouterContextType {
  projectId: string | null;
  navigateToProject: (projectId: string) => void;
}

const DashboardContext = createContext<RouterContextType | undefined>(
  undefined
);

export default DashboardContext;
export type { RouterContextType };
