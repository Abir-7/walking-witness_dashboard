"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookFormValues = {
  bookName: string;
  cover: File | null;
  editions: {
    pdf: File | null;
    language: string;
  }[];
};

export default function UploadBook() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<BookFormValues>({
    defaultValues: {
      bookName: "",
      cover: null,
      editions: [{ pdf: null, language: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "editions",
  });

  const onSubmit = (data: BookFormValues) => {
    console.log("VALID DATA:", data);
  };

  return (
    <div className="border  p-6 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Book Name */}
        <div className="grid gap-2">
          <label className="font-medium">Book Name :</label>
          <Input
            {...register("bookName", {
              required: "Book name is required",
            })}
          />
          {errors.bookName && (
            <p className="text-sm text-red-500">{errors.bookName.message}</p>
          )}
        </div>

        {/* Book Cover */}
        <div className="grid gap-2">
          <label className="font-medium">Upload Book Cover :</label>

          <Controller
            name="cover"
            control={control}
            rules={{
              required: "Cover image is required",
              validate: (file) =>
                file?.type.startsWith("image/")
                  ? true
                  : "Only image files allowed",
            }}
            render={({ field }) => (
              <>
                <label className="relative flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-sm">
                    {field.value ? field.value.name : "Click to upload image"}
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] ?? null)
                    }
                  />
                </label>

                {errors.cover && (
                  <p className="text-sm text-red-500">{errors.cover.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Editions */}
        <div className="grid grid-cols-2 gap-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg space-y-4">
              {/* PDF */}
              <div className="grid gap-2">
                <label className="font-medium">Upload PDF :</label>

                <Controller
                  name={`editions.${index}.pdf`}
                  control={control}
                  rules={{
                    required: "PDF file is required",
                    validate: (file) =>
                      file?.type === "application/pdf"
                        ? true
                        : "Only PDF files allowed",
                  }}
                  render={({ field }) => (
                    <>
                      <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <span className="text-sm">
                          {field.value
                            ? field.value.name
                            : "Click to upload PDF"}
                        </span>

                        <input
                          type="file"
                          className="hidden"
                          accept="application/pdf"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>

                      {errors.editions?.[index]?.pdf && (
                        <p className="text-sm text-red-500">
                          {errors.editions[index]?.pdf?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Language */}
              <div className="grid gap-2">
                <label className="font-medium">Select Language :</label>

                <Controller
                  name={`editions.${index}.language`}
                  control={control}
                  rules={{ required: "Language is required" }}
                  render={({ field }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-60">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="bn">Bangla</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>

                      {errors.editions?.[index]?.language && (
                        <p className="text-sm text-red-500">
                          {errors.editions[index]?.language?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Remove */}
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add more */}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ pdf: null, language: "" })}
        >
          + Add More
        </Button>

        {/* Submit */}
        <Button type="submit" className="ms-5 bg-red-500">
          Save Book
        </Button>
      </form>
    </div>
  );
}
