/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useGetProjectDetailsQuery } from "@/lib/redux/api/dashboardApi";
import { baseUrl } from "@/config/evn";

type Props = {
  projectId: number;
};

export default function ProjectDetailsDisplay({ projectId }: Props) {
  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectDetailsQuery(projectId);

  if (isLoading) {
    return <div className="p-4">Loading project details...</div>;
  }

  if (isError || !project) {
    return <div className="p-4 text-red-500">Failed to load project</div>;
  }

  const coverImage = project.cover_image?.startsWith("http")
    ? project.cover_image
    : `${baseUrl}${project.cover_image}`;

  return (
    <div className="space-y-8 pb-10 p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Projects</span>
        <span>/</span>
        <span className="font-medium text-gray-900">Project Details</span>
      </div>

      {/* Cover Image */}
      <div className="w-[300px] h-[180px] rounded-lg overflow-hidden border">
        <Image
          src={coverImage}
          alt="Project Cover"
          width={300}
          height={180}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>

      {/* Top Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBox label="Project Title" value={project.title} />

        <InfoBox label="Program" value={project.program?.name} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border rounded-lg">
            <p className="p-3 text-lg font-semibold">Basic Information</p>
            <hr />
            <div className="p-3 font-medium  text-[14px]">
              <Field label="Village" value={project.village} />
              <Field label="Location" value={project.location} />
              <Field label="Pastor" value={project.pastor_name} />
              <Field label="Sponsor" value={project.sponsor_name} />
              <Field label="Established" value={project.established_date} />
            </div>
          </div>

          <Card title="Project Details">
            <p className="whitespace-pre-wrap">
              {project.project_details || "-"}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Category">{project.category?.name || "-"}</Card>

          <Card title="Stories">
            <p className="whitespace-pre-wrap">
              {project.project_stories || "-"}
            </p>
          </Card>

          <Card title="Impact">
            <p className="whitespace-pre-wrap">{project.impact || "-"}</p>
          </Card>
        </div>
      </div>

      {/* Pastor Support */}
      <ListCard
        title="Pastor Support Prices"
        items={project.pastor_support_prices?.map(
          (p: any) => `${p.amount} ${p.currency}`,
        )}
      />

      {/* Livestock */}
      <ListCard
        title="Livestock Items"
        items={project.livestock_items?.map(
          (l: any) => `${l.name} × ${l.quantity} — ${l.amount} ${l.currency}`,
        )}
      />

      {/* Other Supports */}
      <ListCard
        title="Other Supports"
        items={project.other_supports?.map(
          (o: any) => `${o.amount} ${o.currency}`,
        )}
      />

      {/* Updates */}
      <Card title="Recent Updates">
        <p className="whitespace-pre-wrap">
          {project.recent_updates || "No updates"}
        </p>
      </Card>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function InfoBox({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-white  rounded-lg border">
      <div className="font-semibold p-3 text-xl">{label}</div>
      <hr />
      <div className="text-gray-700 p-4">{value || "-"}</div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white  rounded-lg border ">
      {title && <p className="p-3 text-lg font-semibold"> {title}</p>}
      <hr />
      <p className="p-3 text-gray-500 font-normal"> {children}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <p>
      <span className="text-gray-700">{label}:</span>{" "}
      <span className="text-gray-500">{value || "-"}</span>
    </p>
  );
}

function ListCard({ title, items }: { title: string; items?: string[] }) {
  return (
    <div className="bg-white  rounded-lg border">
      <strong>{title}</strong>
      <hr />
      <ul className="list-disc pl-5 mt-2">
        {items?.length ? (
          items.map((item, idx) => <li key={idx}>{item}</li>)
        ) : (
          <li>-</li>
        )}
      </ul>
    </div>
  );
}
