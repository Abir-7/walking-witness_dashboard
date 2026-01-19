// app/(dashboard)/upload/content/page.tsx
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";
import UploadContent from "@/components/Dashboard/Upload/UploadContent";

export default function UploadContentPage() {
  return (
    <div>
      <DashboardHeader
        title="Upload Content"
        description="View and manage all uploaded content items."
      />
      <div className="p-4 md:p-8 w-full mx-auto">
        {/* <UploadsClient filterType={FILTER_TYPE} /> */}
        <UploadContent></UploadContent>
      </div>
    </div>
  );
}
