/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useGetPrivacyPoliciesQuery } from "@/lib/redux/api/dashboardApi";
import { useDeletePrivacyPolicyMutation } from "@/lib/redux/api/dashboardWriteApi";

interface Policy {
  id?: number; // server ID
  title: string;
  description: string;
}

export default function PrivacyPolicyList() {
  const { data: policiesData = [], isLoading } = useGetPrivacyPoliciesQuery();
  const [deletePolicy] = useDeletePrivacyPolicyMutation();

  // Initialize state from fetched data once
  const [policies, setPolicies] = useState<Policy[]>(policiesData);

  // Only update state if server data changes and has different length
  // This avoids infinite re-renders
  if (policiesData.length && policies.length !== policiesData.length) {
    setPolicies(policiesData);
  }

  const handleDelete = async (policy: Policy) => {
    if (policy.id !== undefined) {
      try {
        await deletePolicy(policy.id).unwrap();
        toast.success("Policy deleted from server");
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to delete policy");
        return; // stop removing locally if server fails
      }
    }
    setPolicies((prev) => prev.filter((p) => p.id !== policy.id));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {policies.map((policy, index) => (
        <div
          key={policy.id ?? index}
          className="border rounded-lg p-6 relative bg-white dark:bg-gray-800 shadow-sm"
        >
          {/* Delete button */}
          <button
            onClick={() => handleDelete(policy)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-600"
            title="Delete Policy"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Title */}
          <div className="space-y-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Policy Title
            </label>
            <Input value={policy.title} readOnly />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              value={policy.description}
              readOnly
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
      ))}

      {policies.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No privacy policies available.
        </p>
      )}
    </div>
  );
}
