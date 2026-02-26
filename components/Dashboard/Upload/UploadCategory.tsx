"use client";

import { Button } from "@/components/ui/button";
import { useGetCategoriesQuery } from "@/lib/redux/api/dashboardApi";
import { useAddCategoryMutation } from "@/lib/redux/api/dashboardWriteApi";
import { useSoftDeleteCategoryMutation } from "@/lib/redux/api/dashboardWriteApi"; // your soft delete hook
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

type FormValues = {
  name: string;
  image: FileList;
};

interface Category {
  id: number;
  name: string;
  image: string;
}

const UploadCategory = () => {
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [softDeleteCategory, { isLoading: isDeleting }] =
    useSoftDeleteCategoryMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const selectedImage = watch("image");

  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image[0]);
    try {
      await addCategory(formData).unwrap();
      reset();
    } catch (err) {
      console.error("Add category failed", err);
    }
  };

  const previewUrl =
    selectedImage && selectedImage.length > 0
      ? URL.createObjectURL(selectedImage[0])
      : null;

  const confirmDelete = (category: Category) => {
    setSelectedCat(category);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCat) return;
    try {
      console.log(selectedCat.id);
      const res = await softDeleteCategory(selectedCat.id);
      console.log(res);
      setModalOpen(false);
      setSelectedCat(null);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="border p-4 rounded-lg space-y-4">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <label className="block font-semibold">Add New Category</label>

        <div className="flex items-center gap-4">
          {/* Image Upload Box */}
          <label
            htmlFor="image"
            className="relative w-14 h-14 border-2 border-dashed rounded-md cursor-pointer flex items-center justify-center overflow-hidden hover:border-gray-400"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Upload size={20} />
                <span className="text-xs">Upload</span>
              </div>
            )}
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("image", { required: "Image is required" })}
          />

          <input
            type="text"
            placeholder="Category name"
            className="flex-1 border p-2 rounded"
            {...register("name", { required: "Category name is required" })}
          />

          <Button className="bg-red-400" type="submit" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>

        {(errors.image || errors.name) && (
          <p className="text-red-500 text-sm">
            {errors.image?.message}
            {errors.image && errors.name && " • "}
            {errors.name?.message}
          </p>
        )}
      </form>

      {/* Category List */}
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>

        {isLoading && <p className="text-sm">Loading...</p>}
        {isError && <p className="text-sm text-red-500">Failed to load</p>}

        {!isLoading && categories?.length === 0 && (
          <p className="text-sm text-gray-500">No categories found</p>
        )}

        <ul className="space-y-2 w-96">
          {categories?.map((cat: Category) => (
            <li
              key={cat.id}
              className="flex items-center justify-between gap-3 border p-2 rounded"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                  unoptimized
                />
                <span>{cat.name}</span>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => confirmDelete(cat)}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && selectedCat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4">
            <h3 className="font-semibold text-lg">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedCat.name}</span>?
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
                onClick={handleDelete}
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

export default UploadCategory;
