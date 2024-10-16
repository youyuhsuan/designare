import React from "react";
import DashboardContext from "@/src/store/context/DashboardContext";

const useDashboardContext = () => {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};

export default useDashboardContext;
