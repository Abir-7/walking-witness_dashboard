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
    <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <Button asChild className="text-red-400">
          <Link href={`/projects/${projectId}/update`}>Edit Project</Link>
        </Button>
      </div>

      {/* Cover Image (same style as create page) */}
      <div className="relative w-full h-48 rounded-lg border overflow-hidden bg-gray-50">
        <Image
          src={coverImage}
          alt="Project Cover"
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Program" value={project.program?.name} />
          <ReadOnlyField label="Category" value={project.category?.name} />
          <ReadOnlyField label="Village" value={project.village} />
          <ReadOnlyField label="Location" value={project.location} />
          <ReadOnlyField label="Pastor Name" value={project.pastor_name} />
          <ReadOnlyField label="Sponsor Name" value={project.sponsor_name} />
          <ReadOnlyField
            label="Established Date"
            value={project.established_date}
          />
          <ReadOnlyField
            label="Total Benefited Families"
            value={project.total_benefited_families}
          />
          <ReadOnlyField label="Impact" value={project.impact} />
        </div>
      </div>

      {/* Text Sections */}
      <ReadOnlyTextarea
        label="Project Details"
        value={project.project_details}
      />

      <ReadOnlyTextarea label="Recent Updates" value={project.recent_updates} />

      <ReadOnlyTextarea
        label="Project Stories"
        value={project.project_stories}
      />

      {/* Pastor Support Prices */}
      <ArraySection
        title="Pastor Support Prices"
        items={project.pastor_support_prices}
        render={(p: any) => `${p.amount} ${p.currency}`}
      />

      {/* Livestock Items */}
      <ArraySection
        title="Livestock Items"
        items={project.livestock_items}
        render={(l: any) =>
          `${l.name} — ${l.quantity} × ${l.amount} ${l.currency}`
        }
      />

      {/* Other Supports */}
      <ArraySection
        title="Other Supports"
        items={project.other_supports}
        render={(o: any) => `${o.amount} ${o.currency}`}
      />
    </div>
  );
}

/* ===============================
   Inline helpers (same file)
================================ */

function ReadOnlyField({ label, value }: { label: string; value?: any }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="border rounded-lg px-3 py-2 bg-gray-50 text-sm mt-1">
        {value || "-"}
      </div>
    </div>
  );
}

function ReadOnlyTextarea({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="border rounded-lg p-3 bg-gray-50 text-sm whitespace-pre-wrap min-h-20 mt-1">
        {value || "-"}
      </div>
    </div>
  );
}

function ArraySection({
  title,
  items,
  render,
}: {
  title: string;
  items?: any[];
  render: (item: any) => string;
}) {
  return (
    <div className="space-y-4 rounded-xl border p-5 bg-gray-50">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>

      {items?.length ? (
        items.map((item, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-3 text-sm">
            {render(item)}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No data available</p>
      )}
    </div>
  );
}
