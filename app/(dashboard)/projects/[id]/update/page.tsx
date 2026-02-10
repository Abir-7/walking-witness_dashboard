/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  useGetProgramsQuery,
  useGetCategoriesQuery,
  useGetProjectDetailsQuery,
} from "@/lib/redux/api/dashboardApi";
import { useUpdateProjectMutation } from "@/lib/redux/api/dashboardWriteApi";
import { baseUrl } from "@/config/evn";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type ProjectFormData = {
  cover_image: FileList | null;
  title: string;
  program: string;
  category: string;
  village: string;
  location: string;
  pastor_name: string;
  sponsor_name: string;
  established_date: string;
  project_details: string;
  recent_updates: string;
  project_stories: string;
  total_benefited_families: string;
  impact: string;
  pastor_support_prices: { amount: string; currency: string }[];
  livestock_items: {
    name: string;
    amount: string;
    quantity: string;
    currency: string;
  }[];
  other_supports: { amount: string; currency: string }[];
};

export default function ProjectEditPage() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params?.id);

  const { data: project, isLoading: loadingProject } =
    useGetProjectDetailsQuery(projectId);
  const { data: programs = [], isLoading: loadingPrograms } =
    useGetProgramsQuery();
  const { data: categories = [], isLoading: loadingCategory } =
    useGetCategoriesQuery();

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, setValue } =
    useForm<ProjectFormData>({
      defaultValues: {
        cover_image: null,
        title: "",
        program: "",
        category: "",
        village: "",
        location: "",
        pastor_name: "",
        sponsor_name: "",
        established_date: "",
        project_details: "",
        recent_updates: "",
        project_stories: "",
        total_benefited_families: "0",
        impact: "",
        pastor_support_prices: [{ amount: "", currency: "USD" }],
        livestock_items: [
          { name: "", amount: "", quantity: "", currency: "USD" },
        ],
        other_supports: [{ amount: "", currency: "USD" }],
      },
    });

  // Populate form when project loads
  useEffect(() => {
    if (project) {
      const formattedProject: ProjectFormData = {
        ...project,
        program: project.program?.id.toString() || "",
        category: project.category?.id.toString() || "",
        cover_image: null,
        total_benefited_families:
          project.total_benefited_families?.toString() || "0",
        pastor_support_prices: project.pastor_support_prices?.map((p: any) => ({
          amount: p.amount?.toString() || "",
          currency: p.currency || "USD",
        })) || [{ amount: "", currency: "USD" }],
        livestock_items: project.livestock_items?.map((l: any) => ({
          name: l.name || "",
          amount: l.amount?.toString() || "",
          quantity: l.quantity?.toString() || "",
          currency: l.currency || "USD",
        })) || [{ name: "", amount: "", quantity: "", currency: "USD" }],
        other_supports: project.other_supports?.map((o: any) => ({
          amount: o.amount?.toString() || "",
          currency: o.currency || "USD",
        })) || [{ amount: "", currency: "USD" }],
      };

      reset(formattedProject);

      // schedule coverPreview update asynchronously to avoid cascading renders
      if (project.cover_image) {
        setTimeout(() => {
          setCoverPreview(
            project.cover_image.startsWith("http")
              ? project.cover_image
              : `${baseUrl}${project.cover_image}`,
          );
        }, 0);
      }
    }
  }, [project, reset]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverPreview(
      file
        ? URL.createObjectURL(file)
        : project?.cover_image
          ? `${baseUrl}${project.cover_image}`
          : null,
    );
    setValue("cover_image", file ? e.target.files : null);
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const formData = new FormData();

      if (data.cover_image?.[0]) {
        formData.append("cover_image", data.cover_image[0]);
      }

      const payload = {
        ...data,
        program: Number(data.program),
        category: Number(data.category),
        total_benefited_families: Number(data.total_benefited_families),
        pastor_support_prices: data.pastor_support_prices.map((p) => ({
          amount: Number(p.amount),
          currency: p.currency,
        })),
        livestock_items: data.livestock_items.map((l) => ({
          ...l,
          amount: Number(l.amount),
          quantity: Number(l.quantity),
        })),
        other_supports: data.other_supports.map((o) => ({
          amount: Number(o.amount),
          currency: o.currency,
        })),
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "cover_image") return;
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          formData.append(key, String(value));
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });

      await updateProject({ id: projectId, body: formData }).unwrap();
      toast.success("Project updated successfully");
    } catch (err: any) {
      console.error("Update failed", err);
      toast.error("Project update failed");
    }
  };

  if (loadingProject || loadingPrograms || loadingCategory) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      {/* Cover Image */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Cover Image</label>
        <div
          onClick={() => document.getElementById("cover-upload")?.click()}
          className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition bg-gray-50"
        >
          {coverPreview ? (
            <Image
              src={coverPreview}
              alt="Cover preview"
              fill
              className="object-cover rounded-lg"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <span className="text-sm">Click to upload image</span>
            </div>
          )}
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Title" {...register("title")} />
        <SelectField
          label="Program"
          options={programs}
          {...register("program")}
        />
        <SelectField
          label="Category"
          options={categories}
          {...register("category")}
        />
        <Input label="Village" {...register("village")} />
        <Input label="Location" {...register("location")} />
        <Input label="Pastor Name" {...register("pastor_name")} />
        <Input label="Sponsor Name" {...register("sponsor_name")} />
        <Input
          label="Established Date"
          type="date"
          {...register("established_date")}
        />
        <Input
          label="Total Benefited Families"
          type="number"
          {...register("total_benefited_families")}
        />
        <Input label="Impact" {...register("impact")} />
      </div>

      {/* Textareas */}
      <Textarea label="Project Details" {...register("project_details")} />
      <Textarea label="Recent Updates" {...register("recent_updates")} />
      <Textarea label="Project Stories" {...register("project_stories")} />

      {/* Dynamic Arrays */}
      <DynamicArray
        register={register}
        control={control}
        name="pastor_support_prices"
        fields={[{ amount: "", currency: "USD" }]}
        labels={["Amount", "Currency"]}
      />
      <DynamicArray
        register={register}
        control={control}
        name="livestock_items"
        fields={[{ name: "", amount: "", quantity: "", currency: "USD" }]}
        labels={["Name", "Amount", "Quantity", "Currency"]}
      />
      <DynamicArray
        register={register}
        control={control}
        name="other_supports"
        fields={[{ amount: "", currency: "USD" }]}
        labels={["Amount", "Currency"]}
      />

      <Button
        type="submit"
        className="px-5 py-3 bg-red-400 text-white rounded-lg font-medium"
        disabled={isUpdating}
      >
        Update Project
      </Button>
    </form>
  );
}

/* ---------- Reusable Components ---------- */
function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input {...props} className="border p-2 rounded-lg w-full" />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        {...props}
        className="border p-2 rounded-lg w-full min-h-[80px]"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <select
        {...props}
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">Select {label}</option>
        {options?.map((opt: any) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function DynamicArray({ register, control, name, fields, labels }: any) {
  const {
    fields: arrFields,
    append,
    remove,
  } = useFieldArray({ control, name });

  return (
    <div className="space-y-4 rounded-xl border p-5 bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800 capitalize">
          {name.replace(/_/g, " ")}
        </h3>
        <button
          type="button"
          onClick={() => append(fields[0])}
          className="text-sm font-medium text-primary hover:underline"
        >
          + Add
        </button>
      </div>

      {arrFields.map((item: any, index: number) => (
        <div
          key={item.id}
          className="relative rounded-lg border bg-white p-4 shadow-sm space-y-3"
        >
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-3 right-3 text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
          <div
            className={`grid gap-3 ${labels.length === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}
          >
            {labels.map((lbl: string, i: number) => (
              <div key={i} className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  {lbl}
                </label>
                <input
                  {...register(`${name}.${index}.${lbl.toLowerCase()}`)}
                  placeholder={lbl}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
