// app/upload/content/[id]/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";
import { useGetProgramQuery } from "@/lib/redux/api/dashboardApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface TContent {
  id: number;
  image: string;
  name: string;
  title: string;
  information: string;
  description: string;
  type: string;
  link: string;
  allow_project: boolean;
  created_at: string;
}

const ProgramDetailsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: program,
    isLoading,
    isError,
  } = useGetProgramQuery(id!, {
    skip: !id,
  });

  if (!id) return <p className="p-4 text-center text-red-500">Invalid ID</p>;
  if (isLoading)
    return <p className="p-4 text-center text-muted-foreground">Loading...</p>;
  if (isError || !program)
    return <p className="p-4 text-center text-red-500">Program not found</p>;

  return (
    <div className="space-y-12">
      <DashboardHeader
        title="Program Details"
        description="All information and resources for this program."
      />

      <div className="container mx-auto px-4 ">
        <div className="grid md:grid-cols-3  gap-10">
          {/* Image Card */}
          <div className="relative w-full h-full mx-auto  overflow-hidden  max-w-96 max-h-96  bg-white ">
            <Image
              src={program.image}
              alt={program.title}
              width={200}
              height={200}
              className="object-cover w-full h-full"
              priority
              unoptimized
            />
          </div>

          {/* Info Section */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Type Badge */}

            {/* Title */}
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-extrabold text-gray-900">
                {program.title}
              </h1>
              <Link href={`/upload/update/${program.id}`}>
                <Button className="bg-red-400">Update</Button>
              </Link>
            </div>
            <span className="inline-block  text-sm px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold ">
              {program.type}
            </span>

            {/* Information */}
            <p className="text-lg text-gray-700">{program.information}</p>

            {/* External Link Button */}
            {program.link && (
              <a
                href={program.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Watch / View Resource
              </a>
            )}
          </div>
        </div>

        {/* Description Section */}
        {program.description && (
          <div className="mt-12  p-6 rounded-xl shadow-md  ">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              About this Program
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {program.description}
            </p>
          </div>
        )}

        {/* Published Date */}
        <div className="mt-6 text-sm text-gray-500">
          Published on {new Date(program.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;
