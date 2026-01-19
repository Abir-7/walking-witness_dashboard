"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/Dashboard/Shared/Badge";
import { Donation } from "@/types/redux/donation";

interface DonationsTableProps {
  data: Donation[];
  isLoading?: boolean;
}

export function DonationsTable({
  data,
  isLoading = false,
}: DonationsTableProps) {
  return (
    <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary mb-3">Donations</h2>
      </div>

      <div className="overflow-x-auto rounded-b-lg">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                ID
              </th>
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                Title
              </th>
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                Date
              </th>
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                Location
              </th>
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                Donor
              </th>
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                Amount
              </th>
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                Payment Method
              </th>
              <th className="p-5 font-medium text-secondary dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="bg-white">
                    {Array.from({ length: 8 }).map((__, i) => (
                      <td key={i} className="px-5 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((donation) => (
                  <tr
                    key={donation.donation_id}
                    className="bg-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-secondary dark:text-gray-400">
                      {donation.donation_id}
                    </td>
                    <td className="px-5 py-4 font-medium text-primary">
                      {donation.title}
                    </td>
                    <td className="px-5 py-4 text-secondary dark:text-gray-400">
                      {donation.date}
                    </td>
                    <td className="px-5 py-4 text-secondary dark:text-gray-400">
                      {donation.location}
                    </td>
                    <td className="px-5 py-4 text-secondary dark:text-gray-400">
                      {donation.donor}
                    </td>
                    <td className="px-5 py-4 text-primary">
                      ${donation.amount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-secondary dark:text-gray-400">
                      {donation.payment_method}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          donation.payment_status === "success"
                            ? "active"
                            : "pending"
                        }
                      >
                        {donation.payment_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
