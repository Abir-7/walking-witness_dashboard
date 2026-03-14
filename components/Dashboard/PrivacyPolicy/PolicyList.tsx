/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Trash2 } from "lucide-react";
import { useGetPrivacyPoliciesQuery } from "@/lib/redux/api/dashboardApi";
import { useDeletePrivacyPolicyMutation } from "@/lib/redux/api/dashboardWriteApi";

interface PrivacyData {
  id?: number;
  privacy: string;
}

export default function PrivacyPolicyPage() {
  const { data: policyData, isLoading } = useGetPrivacyPoliciesQuery();
  const [deletePolicy] = useDeletePrivacyPolicyMutation();

  const [policy, setPolicy] = useState<PrivacyData | null>(null);

  // Directly set single object
  useEffect(() => {
    if (policyData) {
      setPolicy(policyData); // single object
    }
  }, [policyData]);

  const handleDelete = async () => {
    if (!policy?.id) return;
    try {
      await deletePolicy(policy.id).unwrap();
      toast.success("Privacy policy deleted successfully");
      setPolicy(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete privacy policy");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!policy)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No privacy policy available.
      </p>
    );

  return (
    <div className="border rounded-lg p-6 relative bg-white dark:bg-gray-800 shadow-sm max-w-3xl mx-auto">
      {/* Delete button */}
      {policy.id && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 text-red-500 hover:text-red-600"
          title="Delete Privacy Policy"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Render privacy HTML */}
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: policy.privacy }}
      />
    </div>
  );
}
