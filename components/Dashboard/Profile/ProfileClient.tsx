/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Pencil, Check, X, Lock, Camera } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "../Shared/DashboardHeader";
import { User } from "@/types/redux/auth";
import { useGetmeQuery } from "@/lib/redux/api/authApi";
import {
  useChangePasswordMutation,
  useUpdatePersonalInfoMutation,
} from "@/lib/redux/api/dashboardWriteApi";
import { baseUrl } from "@/config/evn";

interface FormValues {
  fullName: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileClient() {
  const [updatePersonalInfo] = useUpdatePersonalInfoMutation();
  const [changePassword] = useChangePasswordMutation();
  const { data: meData, isLoading, isError } = useGetmeQuery();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (meData?.data) {
      setValue("fullName", meData.data.full_name);
      setAvatarPreview(meData.data.avatar || null);
    }
  }, [meData, setValue]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-lg" />
        <Skeleton className="h-6 w-96 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !meData?.data) {
    return <div className="text-red-500">Failed to load user data.</div>;
  }

  const user: User = meData.data;

  /** Handle Name & Avatar Save */

  console.log(meData?.data?.avatar);

  const onSubmitProfile = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.fullName);

      if (selectedAvatarFile) {
        formData.append("avatar", selectedAvatarFile); // only append if new file
      }

      await updatePersonalInfo(formData).unwrap();

      toast.success("Profile updated");
      setEditingProfile(false);

      // Only clear selectedAvatarFile if a new file was uploaded
      if (selectedAvatarFile) setSelectedAvatarFile(null);
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  /** Handle Password Change */

  const onSubmitPassword = async (data: FormValues) => {
    try {
      if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
        return toast.error("All fields are required");
      }

      if (data.newPassword !== data.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      await changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      }).unwrap();

      toast.success("Password changed successfully");

      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setEditingPassword(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  const handleAvatarChange = (file: File) => {
    setSelectedAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Profile"
        description="Manage your profile details"
      />

      <div className="px-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 space-y-8">
          {/* Edit Button */}

          {/* Avatar + Name + Email */}
          {editingProfile ? (
            <form
              onSubmit={handleSubmit(onSubmitProfile)}
              className="flex flex-col md:flex-row items-center md:items-start gap-6"
            >
              {/* Avatar */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                <Image
                  src={avatarPreview || "/images/avatar.png"}
                  alt="Avatar"
                  unoptimized
                  width={112}
                  height={112}
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random&size=112`;
                  }}
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && handleAvatarChange(e.target.files[0])
                    }
                  />
                </label>
              </div>

              {/* Name + Email */}
              <div className="flex-1 w-full space-y-6">
                {/* Name */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <Controller
                      name="fullName"
                      control={control}
                      rules={{ required: true, maxLength: 32 }}
                      render={({ field }) => (
                        <Input {...field} className="flex-1" />
                      )}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">Invalid name</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <span className="text-gray-700 dark:text-gray-200">
                      {showEmail
                        ? user.email
                        : user.email.replace(/(.{3})(.*)(@.*)/, "$1***$3")}
                    </span>
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    type="button"
                    onClick={() => setShowEmail(!showEmail)}
                  >
                    {showEmail ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Save / Cancel Buttons */}
                <div className="flex gap-2 mt-2">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Save Profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset({ fullName: user.full_name });
                      setAvatarPreview(user.avatar || null);
                      setSelectedAvatarFile(null);
                      setEditingProfile(false);
                    }}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            // Read-only display
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}

              <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                <Image
                  src={`${avatarPreview}` || "/images/avatar.png"}
                  alt="Avatar"
                  width={112}
                  height={112}
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Name + Email */}
              <div className="flex-1 w-full space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-800 dark:text-gray-100 font-medium">
                    {user.full_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-700 dark:text-gray-200">
                    {user.email.replace(/(.{3})(.*)(@.*)/, "$1***$3")}
                  </p>
                </div>
              </div>
              {!editingProfile && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Pencil className="w-4 h-4" /> Edit Profile
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Password Section */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Password
            </label>
            {editingPassword ? (
              <form
                onSubmit={handleSubmit(onSubmitPassword)}
                className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3"
              >
                {["currentPassword", "newPassword", "confirmPassword"].map(
                  (field) => (
                    <Controller
                      key={field}
                      name={field as keyof FormValues}
                      control={control}
                      render={({ field: f }) => (
                        <Input
                          {...f}
                          type={showPassword ? "text" : "password"}
                          placeholder={field
                            .replace(/([A-Z])/g, " $1")
                            .toUpperCase()}
                        />
                      )}
                    />
                  ),
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    id="show-password"
                  />
                  <label
                    htmlFor="show-password"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Show passwords
                  </label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      reset({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setEditingPassword(false);
                    }}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" /> Save
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  •••••••••••••••
                </span>
                <button
                  type="button"
                  onClick={() => setEditingPassword(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Lock className="w-4 h-4" /> Change
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
