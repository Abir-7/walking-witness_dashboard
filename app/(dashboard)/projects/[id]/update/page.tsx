/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Projects/ProjectUpdateForm.tsx
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";

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

export default function ProjectUpdateForm({
  projectId,
}: {
  projectId: number;
}) {
  const { register, control, handleSubmit } = useForm<ProjectFormData>({
    defaultValues: {
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

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const onSubmit = (data: ProjectFormData) => {
    console.log("Submit data:", data);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      {/* Cover Image */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Cover Image</label>
        {coverPreview && (
          <div className="w-[300px] h-[180px] mb-2 relative">
            <Image
              src={coverPreview}
              alt="Cover"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <input
          type="file"
          {...register("cover_image")}
          onChange={handleCoverChange}
          className="block w-full"
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Title" {...register("title")} />
        <Input label="Program" {...register("program")} />
        <Input label="Category" {...register("category")} />
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

      <button
        type="submit"
        className="px-5 py-3 bg-primary text-white rounded-lg font-medium"
      >
        Save Project
      </button>
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
  } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">
        {name.replace(/_/g, " ")}
      </label>
      {arrFields.map((item: any, index: number) => (
        <div
          key={item.id}
          className={`grid gap-2 ${labels.length > 2 ? "grid-cols-4" : "grid-cols-2"}`}
        >
          {labels.map((lbl: string, i: number) => (
            <input
              key={i}
              placeholder={lbl}
              {...register(`${name}.${index}.${lbl.toLowerCase()}`)}
              className="border p-2 rounded-lg"
            />
          ))}
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(fields[0])}
        className="text-primary underline"
      >
        Add {name.replace(/_/g, " ")}
      </button>
    </div>
  );
}
