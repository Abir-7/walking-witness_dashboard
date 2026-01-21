"use client";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";
import UploadContent from "@/components/Dashboard/Upload/UploadContent";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams(); // your dynamic id
  console.log("Content ID:", id);

  return (
    <>
      <DashboardHeader
        title={"Update Content"}
        description={"Update content information"}
      />
      <div className="flex w-full flex-col gap-6 p-5">
        <UploadContent contentId={id as string} />
      </div>
    </>
  );
};

export default Page;
