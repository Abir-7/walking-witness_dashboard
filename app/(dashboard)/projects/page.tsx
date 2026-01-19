// app\(dashboard)\projects\page.tsx
import { ProjectsClient } from "@/components/Dashboard/Projects/ProjectsClient";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";

export default function ProjectsPage() {
  return (
    <div className="h-full flex flex-col">
      <DashboardHeader
        title="All Project"
        description="Track, manage and forecast your customers and Donations."
      />
      <div className="p-4 md:p-8 w-full mx-auto flex-1 ">
        <ProjectsClient />
      </div>
    </div>
  );
}
