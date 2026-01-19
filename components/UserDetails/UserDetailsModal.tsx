"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/lib/redux/api/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { baseUrl } from "@/config/evn";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

const UserDetailsModal = ({
  open,
  onOpenChange,
  userId,
}: UserDetailsModalProps) => {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetUserByIdQuery(userId!, { skip: !userId || !open });
  const data = responseData?.data;

  // Get initials if no avatar
  const getInitials = (name: string) => {
    if (!name) return "NA";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle></DialogTitle>

        {isLoading && <UserDetailsSkeleton />}

        {isError && (
          <p className="text-center text-red-500">
            Failed to load user details
          </p>
        )}

        {data && (
          <div className="flex flex-col items-center text-center p-4">
            {/* Avatar */}
            {data.avatar ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                <Image
                  src={`${baseUrl}${data.avatar}`}
                  alt={data.full_name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-32 h-32 mb-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {getInitials(data.full_name)}
              </div>
            )}

            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {data.full_name}
              </DialogTitle>
            </DialogHeader>

            <div className="w-full space-y-4 text-left mt-4 border p-4 rounded-2xl">
              <InfoRow icon={Mail} value={data.email} />
              <InfoRow
                icon={Calendar}
                value={new Date(data.joined_date).toDateString()}
              />
              <InfoRow icon={Phone} value={data.phone_number || "—"} />
              <InfoRow icon={MapPin} value={data.location || "—"} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;

// InfoRow component
import { LucideIcon } from "lucide-react";

const InfoRow = ({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value: string;
}) => (
  <div className="flex items-center gap-3 text-secondary dark:text-gray-300">
    <Icon className="w-5 h-5 text-blue-600" />
    <span>{value}</span>
  </div>
);

// Skeleton component
const UserDetailsSkeleton = () => (
  <div className="p-6 flex flex-col items-center">
    <Skeleton className="w-32 h-32 rounded-full mb-6" />
    <Skeleton className="h-6 w-40 mb-4" />
    <div className="w-full space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);
