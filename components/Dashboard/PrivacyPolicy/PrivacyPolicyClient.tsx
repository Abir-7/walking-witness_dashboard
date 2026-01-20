/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useUpdatePrivacyPoliciesMutation } from "@/lib/redux/api/dashboardWriteApi";

interface Policy {
  title: string;
  description: string;
}

type FormValues = {
  policies: Policy[];
};

export default function PrivacyPolicyClient() {
  const [updatePolicies, { isLoading: isSaving }] =
    useUpdatePrivacyPoliciesMutation();

  // Start with one empty policy
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { policies: [{ title: "", description: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "policies",
  });

  const onSubmit = async (values: FormValues) => {
    if (values.policies.some((p) => !p.title || !p.description)) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      console.log("Payload to send:", values.policies);
      await updatePolicies(values.policies).unwrap();
      toast.success("Policies saved");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save policies");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded-lg p-6 relative bg-white dark:bg-gray-800 shadow-sm"
        >
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-600"
              title="Delete Policy"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Title */}
          <div className="space-y-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Policy Title
            </label>
            <Input
              {...control.register(`policies.${index}.title` as const)}
              placeholder="Enter policy title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              {...control.register(`policies.${index}.description` as const)}
              placeholder="Enter policy description"
              className="min-h-25 resize-none"
            />
            <p className="text-xs text-gray-400 text-right">
              275 characters max
            </p>
          </div>
        </div>
      ))}

      {/* Add Policy Button */}
      <button
        type="button"
        onClick={() => append({ title: "", description: "" })}
        className="w-full border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-5 h-5" /> Add Policy
      </button>

      {/* Save Button */}
      <Button
        type="submit"
        disabled={isSaving}
        className="mt-4 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
      >
        {isSaving ? "Saving..." : "Save Policies"}
      </Button>
    </form>
  );
}
