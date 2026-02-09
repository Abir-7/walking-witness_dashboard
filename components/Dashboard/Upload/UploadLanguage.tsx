import { Button } from "@/components/ui/button";
import { useGetBookLanguagesQuery } from "@/lib/redux/api/dashboardApi";
import { useAddBookLanguageMutation } from "@/lib/redux/api/dashboardWriteApi";
import React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  language_name: string;
};

interface BookLanguage {
  code: string;
  name: string;
}

const UploadLanguage = () => {
  const [addBookLanguage, { isLoading: isAdding }] =
    useAddBookLanguageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const { data: languages, isLoading, isError } = useGetBookLanguagesQuery();

  const onSubmit = async (formData: FormValues) => {
    try {
      await addBookLanguage({
        language_name: formData.language_name,
      }).unwrap();

      reset();
    } catch (err) {
      console.error("Add language failed", err);
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadLanguage;
