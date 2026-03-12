/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Projects/ProjectCreateForm.tsx
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import {
  useGetProgramsQuery,
  useGetCategoriesQuery,
} from "@/lib/redux/api/dashboardApi";
import { useCreateProjectMutation } from "@/lib/redux/api/dashboardWriteApi";
import { baseUrl } from "@/config/evn";
import { Button } from "@/components/ui/button";
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
  total_benefited_families: number;
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

export default function ProjectCreateForm() {
  const { data: programs = [], isLoading: loadingPrograms } =
    useGetProgramsQuery();
  const { data: categories = [], isLoading: loadingCategory } =
    useGetCategoriesQuery();
  const [createProject, { isLoading: isCreating, error }] =
    useCreateProjectMutation();
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
        total_benefited_families: 0,
        impact: "",
        pastor_support_prices: [{ amount: "", currency: "USD" }],
        livestock_items: [
          { name: "", amount: "", quantity: "", currency: "USD" },
        ],
        other_supports: [{ amount: "", currency: "USD" }],
      },
    });

  const hasDuplicatePrice = (items: { amount: string; currency: string }[]) => {
    const seen = new Set();

    for (const item of items) {
      const key = `${item.amount}-${item.currency}`;
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
    }

    return false;
  };
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverPreview(file ? URL.createObjectURL(file) : null);
    setValue("cover_image", file ? e.target.files : null); // <-- important
  };

  const onSubmit = async (data: ProjectFormData) => {
    console.log(data);
    if (hasDuplicatePrice(data.pastor_support_prices)) {
      toast.error("Pastor support prices cannot have duplicate amounts");
      return;
    }

    if (hasDuplicatePrice(data.other_supports)) {
      toast.error("Other support prices cannot have duplicate amounts");
      return;
    }

    const livestockPriceCheck = data.livestock_items.map((i) => ({
      amount: i.amount,
      currency: i.currency,
    }));

    if (hasDuplicatePrice(livestockPriceCheck)) {
      toast.error("Livestock prices cannot have duplicate amounts");
      return;
    }

    try {
      const formData = new FormData();

      if (data.cover_image?.[0]) {
        formData.append("cover_image", data.cover_image[0]);
      }

      const payload = {
        ...data,
        program: Number(data.program),
        category: Number(data.category),
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

      await createProject({ body: formData }).unwrap();
      toast.success("Project created successfully");
      reset(); // reset form
      setCoverPreview(null);
    } catch (err: any) {
      console.error("Create failed", err);
      toast.error("Failed to create project");
    }
  };

  if (loadingPrograms || loadingCategory) {
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v7m0-7l-3 3m3-3l3 3M12 3v9"
                />
              </svg>
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverChange} // manually set the value
            className="hidden"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Title" {...register("title")} />
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Program</label>
          <select
            {...register("program")}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a program</option>
            {programs.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
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
      >
        Create Project
      </Button>
    </form>
  );
}

/* ---------- Components ---------- */
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

      {arrFields.length === 0 && (
        <p className="text-sm text-gray-400">No items added yet</p>
      )}

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
