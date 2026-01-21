"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUploadBookMutation } from "@/lib/redux/api/dashboardWriteApi";
import { useGetBookLanguagesQuery } from "@/lib/redux/api/dashboardApi";
import Image from "next/image";

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

  const {
    data: languages,
    isLoading: languagesLoading,
    isError: languagesError,
  } = useGetBookLanguagesQuery();

  const [uploadBook, { isLoading }] = useUploadBookMutation();

  const onSubmit = async (data: BookFormValues) => {
    try {
      const formData = new FormData();

      formData.append("book_name", data.bookName);

      if (data.cover) {
        formData.append("cover", data.cover);
      }

      data.editions.forEach((edition) => {
        if (edition.pdf) {
          formData.append("pdf", edition.pdf);
        }
        formData.append("language", edition.language);
      });

      await uploadBook(formData).unwrap();
      toast.success("Book uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload book");
    }
  };

  return (
    <div className="border p-6 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Book Name */}
        <div className="grid gap-2">
          <label className="font-medium">Book Name</label>
          <Input
            {...register("bookName", {
              required: "Book name is required",
            })}
          />
          {errors.bookName && (
            <p className="text-sm text-red-500">{errors.bookName.message}</p>
          )}
        </div>

        {/* Cover Image */}
        <div className="grid gap-2">
          <label className="font-medium">Upload Book Cover</label>

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
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer overflow-hidden">
                  {field.value ? (
                    <Image
                      width={100}
                      height={100}
                      src={URL.createObjectURL(field.value)}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <span className="text-sm">Click to upload image</span>
                    </>
                  )}

                  <input
                    type="file"
                    hidden
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
          {fields.map((item, index) => (
            <div key={item.id} className="border p-4 rounded-lg space-y-4">
              {/* PDF Upload */}
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
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer text-center px-2">
                      {field.value ? (
                        <>
                          <p className="text-sm font-medium truncate">
                            {field.value.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(field.value.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs underline mt-1">
                            Click to change PDF
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <span className="text-sm">Click to upload PDF</span>
                        </>
                      )}

                      <input
                        type="file"
                        hidden
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

              {/* Language */}
              <Controller
                name={`editions.${index}.language`}
                control={control}
                rules={{ required: "Language is required" }}
                render={({ field }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-60">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>

                      <SelectContent>
                        {languagesLoading && (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        )}

                        {languagesError && (
                          <SelectItem value="error" disabled>
                            Failed to load
                          </SelectItem>
                        )}

                        {languages?.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
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

              {/* Remove Edition */}
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

        {/* Add More */}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ pdf: null, language: "" })}
        >
          + Add More
        </Button>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading || languagesLoading}
          className="ms-5 bg-red-500"
        >
          Save Book
        </Button>
      </form>
    </div>
  );
}
