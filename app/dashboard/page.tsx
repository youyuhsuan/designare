import React from "react";
import Navbar from "@/src/components/Navbar";
import Dashboard from "@/src/components/dashboard/Dashboard";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardProvider from "@/src/store/provider/DashboardProvider";

export default function Page() {
  return (
    <DashboardProvider>
      <Navbar />
      <div>
        <DashboardHeader />
        <Dashboard />
      </div>
    </DashboardProvider>
  );
}
