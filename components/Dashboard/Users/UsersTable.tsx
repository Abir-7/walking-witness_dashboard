/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

import { Badge } from "@/components/Dashboard/Shared/Badge";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationModal } from "@/components/Dashboard/Shared/DeleteConfirmationModal";
import { toast } from "sonner";
import { useState } from "react";
import { LatestUser } from "@/types/redux/dashboard_over-view";
import { useDeleteUserMutation } from "@/lib/redux/api/dashboardApi";
import UserDetailsModal from "@/components/UserDetails/UserDetailsModal";
import { baseUrl } from "@/config/evn";

interface UsersTableProps {
  isLoading?: boolean;
  data: LatestUser[];
}

export function UsersTable({ isLoading = false, data }: UsersTableProps) {
  const [userToDelete, setUserToDelete] = useState<LatestUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteUser] = useDeleteUserMutation();

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  };
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async (user_id?: string) => {
    if (!user_id) {
      toast.error("Invalid user selected");
      setUserToDelete(null);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUser({ user_id }).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-b-xl border border-[#FAFAFA] dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs bg-gray-50 dark:bg-gray-700/50 uppercase">
            <tr>
              <th className="p-5">Name</th>
              <th className="p-5">Email</th>
              <th className="p-5">Joining Date</th>
              <th className="p-5">Location</th>
              <th className="p-5">Role</th>
              <th className="p-5">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-5">
                    <Skeleton className="h-6 w-32" />
                  </td>
                  <td className="p-5">
                    <Skeleton className="h-6 w-40" />
                  </td>
                  <td className="p-5">
                    <Skeleton className="h-6 w-24" />
                  </td>
                  <td className="p-5">
                    <Skeleton className="h-6 w-24" />
                  </td>
                  <td className="p-5">
                    <Skeleton className="h-6 w-16" />
                  </td>
                  <td className="p-5">
                    <Skeleton className="h-6 w-6" />
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="p-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setOpen(true);
                      }}
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 overflow-hidden">
                        {user.avatar ? (
                          <Image
                            src={`${baseUrl}${user.avatar}`}
                            alt={user.full_name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          getInitials(user.full_name)
                        )}
                      </div>
                      <span className="font-medium">{user.full_name}</span>
                    </button>
                  </td>

                  <td className="p-5">{user.email}</td>
                  <td className="p-5">
                    {new Date(user.joined_date).toLocaleDateString()}
                  </td>
                  <td className="p-5">{user.location || "-"}</td>
                  <td className="p-5">
                    <Badge variant={user.role.toLowerCase() as any}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-5">
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserDetailsModal
        open={open}
        onOpenChange={setOpen}
        userId={selectedUserId}
      />
      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => !isDeleting && setUserToDelete(null)}
        onConfirm={() => handleDelete(userToDelete?.id)}
        isLoading={isDeleting}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.full_name}?`}
      />
    </div>
  );
}
