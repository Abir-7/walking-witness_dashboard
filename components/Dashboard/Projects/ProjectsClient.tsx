// components/Dashboard/Projects/ProjectsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignSquareIcon } from "@hugeicons/core-free-icons";
import CPagination from "../CPagination";

import { useGetProjectsQuery } from "@/lib/redux/api/dashboardApi";
import { useDeleteProjectMutation } from "@/lib/redux/api/dashboardWriteApi";
import { TProject } from "@/types/redux/project";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "../Shared/DeleteConfirmationModal";
import { toast } from "sonner";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function ProjectsClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const page = Number(searchParams.get("page")) || 1;

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery !== debouncedSearch) {
        handlePageChange(1); // reset page on new search
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // fetch projects from API
  const { data, isLoading, isError } = useGetProjectsQuery({
    search_term: debouncedSearch,
    page,
    page_size: 5,
  });

  const currentData: TProject[] = data?.results || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId).unwrap();
      toast.success("Project deleted successfully");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete project");
    }
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
          <Link href="/projects/create">
            <Button className="text-red-500">
              <HugeiconsIcon
                icon={PlusSignSquareIcon}
                size={20}
                strokeWidth={1}
              />
              Add
            </Button>
          </Link>
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
                <th className="p-5 font-medium text-secondary dark:text-gray-400 text-center">
                  Actions
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
                    <td className="p-5">
                      <Skeleton className="h-4 w-10 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
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
                    <td className="p-5 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(item.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
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
          onPageChange={handlePageChange}
        />
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}
