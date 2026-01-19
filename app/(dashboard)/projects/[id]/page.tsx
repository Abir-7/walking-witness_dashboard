"use client";
import ProjectDetailsDisplay from "@/components/Dashboard/Projects/ProjectDetails";
import { useParams } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  const { id } = useParams();
  return <ProjectDetailsDisplay projectId={Number(id)} />;
}
