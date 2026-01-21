"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useGetProgramQuery } from "@/lib/redux/api/dashboardApi";
import { useUpdateProgramMutation } from "@/lib/redux/api/dashboardWriteApi";
import { toast } from "sonner";

type FormValues = {
  title: string;
  description: string;
  type: string;
  info: string;
};

const UploadContent = ({ contentId }: { contentId: string }) => {
  console.log(contentId);
  const [updateProgram, { isLoading: isUpdating, error }] =
    useUpdateProgramMutation();
  console.log(error);
  const {
    data: program,
    isLoading,
    isError,
  } = useGetProgramQuery(contentId!, {
    skip: !contentId,
  });

  const {
    handleSubmit,
    register,

    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      type: "",
      info: "",
    },
  });

  // ✅ Populate form when program data is available
  useEffect(() => {
    if (program) {
      reset({
        title: program.title || "",
        description: program.description || "",
        type: program.type || "",
        info: program.information || "",
      });
    }
  }, [program, reset]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("information", data.info); // backend expects "information"
    formData.append("description", data.description);

    try {
      const res = await updateProgram({
        id: contentId,
        data: formData,
      }).unwrap();
      toast.success("Content updated successfully");
      console.log("Update success:", res);
    } catch (err) {
      toast.error("Failed to update content");
      console.error("Update error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border rounded-lg shadow-sm bg-white"
    >
      {/* Title */}
      <div className="flex gap-4 ">
        <div className="grid gap-2 flex-1">
          <label className="font-medium">Title</label>
          <Input
            placeholder="Enter title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* <div className="grid gap-2">
          <label className="font-medium">Type</label>
          <Controller
            control={control}
            name="type"
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div> */}
      </div>

      {/* Info */}
      <div className="grid gap-2">
        <label className="font-medium">Information</label>
        <Input
          placeholder="Enter information"
          {...register("info", { required: "Information is required" })}
        />
        {errors.info && (
          <p className="text-sm text-red-500">{errors.info.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <label className="font-medium">Description</label>
        <Textarea
          placeholder="Enter description"
          {...register("description", {
            required: "Description is required",
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button className="bg-red-500" type="submit">
        Save Content
      </Button>
    </form>
  );
};

export default UploadContent;
