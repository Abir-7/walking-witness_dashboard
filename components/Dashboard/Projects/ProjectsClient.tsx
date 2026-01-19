// components/Dashboard/Projects/ProjectsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignSquareIcon } from "@hugeicons/core-free-icons";
import CPagination from "../CPagination";

import { useGetProjectsQuery } from "@/lib/redux/api/dashboardApi";
import { TProject } from "@/types/redux/project";
import Link from "next/link";

export function ProjectsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // fetch projects from API
  const { data, isLoading, isError } = useGetProjectsQuery({
    search_term: debouncedSearch,
    page,
    page_size: 10,
  });

  const currentData: TProject[] = data?.results || [];

  const handleRowClick = (id: number) => {
    console.log("Clicked project ID:", id);
    // Open modal or navigate to project detail here
  };

  if (isError)
    return (
      <p className="text-center text-red-500 mt-4">Error fetching projects</p>
    );

  return (
    <div className="flex flex-col h-full ">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex-1">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-primary dark:text-gray-50">
            Projects
          </h2>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors text-sm font-medium cursor-pointer">
            <HugeiconsIcon
              icon={PlusSignSquareIcon}
              size={20}
              strokeWidth={1}
            />
            Add
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-800 text-primary placeholder-gray-500 h-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-b-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-5 font-medium text-secondary dark:text-gray-400">
                  Project name
                </th>
                <th className="p-5 font-medium text-secondary dark:text-gray-400">
                  Date
                </th>
                <th className="p-5 font-medium text-secondary dark:text-gray-400">
                  Location
                </th>
                <th className="p-5 font-medium text-secondary dark:text-gray-400">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-800">
                    <td className="p-5">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-5">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-5">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="p-5">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              ) : currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <td className="p-5 font-medium text-primary">
                      <Link href={`/projects/${item.id}`}> {item.title}</Link>
                    </td>
                    <td className="p-5 text-secondary dark:text-gray-400">
                      {item.established_date}
                    </td>
                    <td className="p-5 text-secondary dark:text-gray-400">
                      {item.location}
                    </td>
                    <td className="p-5 text-primary dark:text-blue-400">
                      {item.category.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-secondary dark:text-gray-400"
                  >
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
      </div>{" "}
      <div className="p-4">
        <CPagination
          page={page}
          totalPages={data?.total_pages || 1}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}
