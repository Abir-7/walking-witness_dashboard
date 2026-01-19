"use client";
import { StatsCard } from "@/components/Dashboard/Shared/StatsCard";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";
import { useGetDonationsQuery } from "@/lib/redux/api/dashboardApi";
import { Search } from "lucide-react";
import { DonationsTable } from "@/components/Dashboard/Donations/DonationsTable";
import CPagination from "@/components/Dashboard/CPagination";
import { useState, useEffect } from "react";

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useGetDonationsQuery({
    page: currentPage,
    page_size: pageSize,
    search_term: debouncedSearch,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading donations</p>;

  return (
    <div className="h-[calc(100%-97px)]">
      <DashboardHeader
        title="Donations"
        description="Track, manage and forecast your customers and Donations."
      />

      <div className="p-4 md:p-8 w-full mx-auto flex flex-col h-full ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            label="Total Donations"
            value={data?.summary.total_earning || 0}
            trend={data?.summary.earning_growth.growth_percent || 0}
            trendLabel="vs last month"
            className="h-full"
          />
          <StatsCard
            label="Active Donations"
            value={data?.summary.total_donation || 0}
            trend={data?.summary.donation_growth.growth_percent || 0}
            trendLabel="vs last month"
            className="h-full"
          />
        </div>

        <div className="space-y-4 mt-6 flex-1">
          {/* Search Input */}
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary mb-3">
              Donations
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset page when searching
                }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-primary placeholder-gray-500"
              />
            </div>
          </div>

          {/* Donations Table */}
          <DonationsTable data={data?.donations || []} />
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <CPagination
            page={data?.pagination.page || 1}
            totalPages={data?.pagination.total_pages || 1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
