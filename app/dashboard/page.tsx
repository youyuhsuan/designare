import React from "react";
import Navbar from "@/src/components/Navbar";
import Dashboard from "@/src/components/dashboard/Dashboard";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";

export default function Page() {
  return (
    <>
      <Navbar />
      <div>
        <DashboardHeader />
        <Dashboard />
      </div>
    </>
  );
}
