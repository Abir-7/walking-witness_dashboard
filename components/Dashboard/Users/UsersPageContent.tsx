"use client";

import { UsersTable } from "@/components/Dashboard/Users/UsersTable";

import { Search } from "lucide-react";
import DashboardHeader from "../Shared/DashboardHeader";
import { useState, useEffect } from "react";
import { useGetAllUsersQuery } from "@/lib/redux/api/dashboardApi";
import CPagination from "../CPagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function UsersPageContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const page = Number(searchParams.get("page")) || 1;
  const page_size = 8;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery !== debouncedSearch) {
        handlePageChange(1); // reset page on new search
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useGetAllUsersQuery({
    page,
    page_size,
    search_term: debouncedSearch,
  });

  if (isError) return <p className="p-4">Error fetching users</p>;

  const users = data?.data ?? [];
  const totalPages = data?.num_pages ?? 1; // adjust to your API

  return (
    <>
      <DashboardHeader
        title="Our Users"
        description="Track, manage and forecast your customers and Donations."
      />

      <div className="p-4 md:p-8 w-full mx-auto flex flex-col h-full">
        <div className="bg-white rounded-xl border border-[#E9EAEB] flex-1">
          {/* Search */}
          <div className="flex justify-between items-center px-4 py-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
              />
            </div>
          </div>

          {/* Table */}
          <UsersTable data={users} isLoading={isLoading} />

          {/* Pagination */}
        </div>
        <div className="p-4 flex justify-end">
          <CPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
