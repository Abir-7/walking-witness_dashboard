/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (isError || !project) {
    return (
      <div className="p-6 text-sm text-red-500">Failed to load project</div>
    );
  }

  const coverImage = project.cover_image?.startsWith("http")
    ? project.cover_image
    : `${baseUrl}${project.cover_image}`;

  return (
    <div className="space-y-10 p-6 pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Projects <span className="mx-1">/</span>
        <span className="font-medium text-foreground">Project Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="text-sm text-muted-foreground">
            Program: {project.program?.name || "-"}
          </p>
        </div>

        <Button asChild className="w-fit">
          <Link href={`/projects/${projectId}/update`}>Edit Project</Link>
        </Button>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-6/2 overflow-hidden rounded-xl border bg-muted">
        <Image
          src={coverImage}
          alt="Project Cover"
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info Boxes */}
      <div className="grid gap-6 md:grid-cols-2">
        <InfoBox label="Village" value={project.village} />
        <InfoBox label="Location" value={project.location} />
        <InfoBox label="Pastor" value={project.pastor_name} />
        <InfoBox label="Sponsor" value={project.sponsor_name} />
        <InfoBox label="Established" value={project.established_date} />
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Project Details">{project.project_details}</Card>

        <Card title="Category">{project.category?.name}</Card>

        <Card title="Stories">{project.project_stories}</Card>

        <Card title="Impact">{project.impact}</Card>
      </div>

      {/* Lists */}
      <ListCard
        title="Pastor Support Prices"
        items={project.pastor_support_prices?.map(
          (p: any) => `${p.amount} ${p.currency}`,
        )}
      />

      <ListCard
        title="Livestock Items"
        items={project.livestock_items?.map(
          (l: any) => `${l.name} × ${l.quantity} — ${l.amount} ${l.currency}`,
        )}
      />

      <ListCard
        title="Other Supports"
        items={project.other_supports?.map(
          (o: any) => `${o.amount} ${o.currency}`,
        )}
      />

      <Card title="Recent Updates">
        {project.recent_updates || "No updates yet"}
      </Card>
    </div>
  );
}
function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-4 py-3 text-sm font-medium">{title}</div>
      <div className="px-4 py-4 text-sm text-muted-foreground whitespace-pre-wrap">
        {children || "-"}
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items?: string[] }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-4 py-3 text-sm font-medium">{title}</div>
      <ul className="space-y-2 px-4 py-4 text-sm text-muted-foreground">
        {items?.length ? (
          items.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="italic text-muted-foreground">No data available</li>
        )}
      </ul>
    </div>
  );
}
