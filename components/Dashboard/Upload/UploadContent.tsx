"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = {
  title: string;
  description: string;
  type: string;
  info: string;
};

const UploadContent = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      type: "",
      info: "",
    },
  });

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Logs the submitted form data to the console
   * @param {FormValues} data - The form data
   */
  /*******  07991238-f49c-4402-b389-a5387fc0a41d  *******/
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);
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

        <div className="grid gap-2">
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
        </div>
      </div>
      <div className="grid gap-2">
        <label className="font-medium">Information</label>
        <Input
          placeholder="Enter title"
          {...register("info", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
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

      {/* Type */}

      {/* Submit */}
      <Button className="bg-red-500" type="submit">
        Save Content
      </Button>
    </form>
  );
};

export default UploadContent;
