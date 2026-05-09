"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Upload, Edit } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useUpdateBookMutation } from "@/lib/redux/api/dashboardWriteApi";

type EditBookFormValues = {
  name: string;
  cover: File | null;
};

interface EditBookModalProps {
  bookId: number | string;
  initialName: string;
  initialCover: string;
}

const EditBookModal = ({ bookId, initialName, initialCover }: EditBookModalProps) => {
  const { control, handleSubmit, register, reset } = useForm<EditBookFormValues>({
    defaultValues: {
      name: initialName,
      cover: null,
    },
  });

  const [updateBook, { isLoading }] = useUpdateBookMutation();

  const onSubmit = async (values: EditBookFormValues) => {
    const formData = new FormData();
    if (values.name !== initialName) {
      formData.append("name", values.name);
    }
    if (values.cover) {
      formData.append("cover", values.cover);
    }

    // If nothing changed, just close
    if (formData.entries().next().done) {
        toast.info("No changes made");
        return;
    }

    try {
      await updateBook({ bookId, body: formData }).unwrap();
      toast.success("Book updated successfully");
      reset({ name: values.name, cover: null });
    } catch {
      toast.error("Failed to update book");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Details
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Book Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Book Name</label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Enter book name"
            />
          </div>

          {/* Cover Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image</label>
            <Controller
              name="cover"
              control={control}
              render={({ field }) => (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer text-center overflow-hidden">
                  {field.value ? (
                    <Image
                      src={URL.createObjectURL(field.value)}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <span className="text-sm">Click to change cover</span>
                      <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current cover</p>
                    </div>
                  )}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500"
          >
            {isLoading ? "Updating..." : "Update Book"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookModal;
