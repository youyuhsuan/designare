"use client";

import { useRouter, useParams } from "next/navigation";
import DashboardContext, {
  RouterContextType,
} from "@/src/store/context/DashboardContext";
import { ReactNode, useCallback } from "react";

interface DashboardProviderProps {
  children: ReactNode;
}

const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  const projectId =
    typeof params.projectId === "string" ? params.projectId : null;

  const navigateToProject = useCallback(
    (projectId: string) => {
      router.push(`project/editor/${projectId}`);
    },
    [router]
  );

  const value: RouterContextType = {
    projectId,
    navigateToProject,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
