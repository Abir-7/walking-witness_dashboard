"use client";
import ProjectDetailsDisplay from "@/components/Dashboard/Projects/ProjectDetails";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  console.log(id);
  return (
    <div>
      <ProjectDetailsDisplay projectId={Number(id)}></ProjectDetailsDisplay>
    </div>
  );
};

export default Page;
