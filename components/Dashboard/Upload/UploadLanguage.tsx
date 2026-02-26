"use client";

import { Button } from "@/components/ui/button";
import { useGetBookLanguagesQuery } from "@/lib/redux/api/dashboardApi";
import {
  useAddBookLanguageMutation,
  useSoftDeleteLanguageMutation,
} from "@/lib/redux/api/dashboardWriteApi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  language_name: string;
};

interface BookLanguage {
  code: string;
  name: string;
  id: number;
}

const UploadLanguage = () => {
  const [addBookLanguage, { isLoading: isAdding }] =
    useAddBookLanguageMutation();
  const [softDeleteLanguage, { isLoading: isDeleting }] =
    useSoftDeleteLanguageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const { data: languages, isLoading, isError } = useGetBookLanguagesQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<BookLanguage | null>(null);

  const onSubmit = async (formData: FormValues) => {
    try {
      await addBookLanguage({ language_name: formData.language_name }).unwrap();
      reset();
    } catch (err) {
      console.error("Add language failed", err);
    }
  };

  const confirmDelete = (lang: BookLanguage) => {
    setSelectedLang(lang);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedLang) return;
    try {
      await softDeleteLanguage(selectedLang.id);
      setModalOpen(false);
      setSelectedLang(null);
    } catch (err) {
      toast.error("Failed to delete language");
      alert("Failed to delete language");
    }
  };

  return (
    <div className="border p-4 rounded-lg space-y-4">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-1 font-semibold">Add New Language</label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            className="w-full border p-2 rounded"
            {...register("language_name", {
              required: "Language name is required",
            })}
          />

          <Button type="submit" className="bg-red-400" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>

        {errors.language_name && (
          <p className="text-red-500 text-sm">{errors.language_name.message}</p>
        )}
      </form>

      {/* Language List */}
      <div>
        <h3 className="font-semibold mb-2">Languages</h3>

        {isLoading && <p className="text-sm">Loading...</p>}
        {isError && <p className="text-sm text-red-500">Failed to load</p>}
        {!isLoading && languages?.length === 0 && (
          <p className="text-sm text-gray-500">No languages found</p>
        )}

        <ul className="space-y-2 w-96">
          {languages?.map((lang: BookLanguage) => (
            <li
              key={lang.code}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{lang.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => confirmDelete(lang)}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && selectedLang && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4">
            <h3 className="font-semibold text-lg">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedLang.name}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete()}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadLanguage;
