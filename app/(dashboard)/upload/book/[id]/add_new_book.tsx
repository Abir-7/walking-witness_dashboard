// "use client";

// import { useForm, Controller } from "react-hook-form";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Upload, Plus } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";

// import { useGetBookLanguagesQuery } from "@/lib/redux/api/dashboardApi";
// // import { useAddBookPdfMutation } from "@/lib/redux/api/dashboardWriteApi";

// interface AddPdfModalProps {
//   bookId: number | string;
// }

// type AddPdfFormValues = {
//   pdf: File | null;
//   language: string;
// };

// const AddPdfModal = ({ bookId }: AddPdfModalProps) => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<AddPdfFormValues>({
//     defaultValues: {
//       pdf: null,
//       language: "",
//     },
//   });

//   const { data: languages, isLoading: languagesLoading } =
//     useGetBookLanguagesQuery();

//   // const [addBookPdf, { isLoading }] = useAddBookPdfMutation();
//   const isLoading = false;

//   const onSubmit = async (data: AddPdfFormValues) => {
//     try {
//       const formData = new FormData();
//       formData.append("pdf", data.pdf as File);
//       formData.append("language", data.language);

//       // await addBookPdf({ bookId, formData }).unwrap();

//       console.log("Add PDF", { bookId, data });

//       toast.success("PDF added successfully");
//       reset();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to add PDF");
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger className="rounded-lg bg-red-200 px-3 py-1 text-red-500 hover:bg-red-400 hover:text-white">
//         <Plus />
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Add new PDF</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           {/* PDF Upload */}
//           <Controller
//             name="pdf"
//             control={control}
//             rules={{
//               required: "PDF file is required",
//               validate: (file) =>
//                 file?.type === "application/pdf"
//                   ? true
//                   : "Only PDF files allowed",
//             }}
//             render={({ field }) => (
//               <div>
//                 <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
//                   {field.value ? (
//                     <>
//                       <p className="text-sm font-medium truncate">
//                         {field.value.name}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {(field.value.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                       <p className="text-xs underline mt-1">
//                         Click to change PDF
//                       </p>
//                     </>
//                   ) : (
//                     <>
//                       <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
//                       <span className="text-sm">Click to upload PDF</span>
//                     </>
//                   )}

//                   <input
//                     type="file"
//                     hidden
//                     accept="application/pdf"
//                     onChange={(e) =>
//                       field.onChange(e.target.files?.[0] ?? null)
//                     }
//                   />
//                 </label>

//                 {errors.pdf && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.pdf.message}
//                   </p>
//                 )}
//               </div>
//             )}
//           />

//           {/* Language Select */}
//           <Controller
//             name="language"
//             control={control}
//             rules={{ required: "Language is required" }}
//             render={({ field }) => (
//               <div>
//                 <Select value={field.value} onValueChange={field.onChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select language" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {languagesLoading && (
//                       <SelectItem value="loading" disabled>
//                         Loading...
//                       </SelectItem>
//                     )}

//                     {languages?.map((lang) => (
//                       <SelectItem key={lang.code} value={lang.code}>
//                         {lang.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {errors.language && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.language.message}
//                   </p>
//                 )}
//               </div>
//             )}
//           />

//           {/* Submit */}
//           <Button
//             type="submit"
//             className="w-full bg-red-500"
//             disabled={isLoading}
//           >
//             Add PDF
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddPdfModal;

"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetBookLanguagesQuery } from "@/lib/redux/api/dashboardApi";
import { useAddBookPdfMutation } from "@/lib/redux/api/dashboardWriteApi";

type AddPdfFormValues = {
  pdf: File | null;
  language: string;
};

interface AddPdfModalProps {
  bookId: number | string;
}

const AddPdfModal = ({ bookId }: AddPdfModalProps) => {
  const { control, handleSubmit, reset } = useForm<AddPdfFormValues>({
    defaultValues: {
      pdf: null,
      language: "",
    },
  });

  const { data: languages } = useGetBookLanguagesQuery();
  const [addBookPdf, { isLoading }] = useAddBookPdfMutation();

  const onSubmit = async (values: AddPdfFormValues) => {
    if (!values.pdf || !values.language) return;

    const formData = new FormData();
    formData.append("pdf", values.pdf);
    formData.append("language", values.language);

    try {
      await addBookPdf({ bookId, data: formData }).unwrap();
      toast.success("PDF added successfully");
      reset();
    } catch {
      toast.error("Failed to add PDF");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-red-200 px-3 py-1 rounded-lg text-red-400 hover:bg-red-400 hover:text-white">
        <Plus />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New PDF</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* PDF Upload */}
          <Controller
            name="pdf"
            control={control}
            rules={{
              required: "PDF is required",
              validate: (file) =>
                file?.type === "application/pdf" || "Only PDF files allowed",
            }}
            render={({ field }) => (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer text-center">
                {field.value ? (
                  <>
                    <p className="text-sm font-medium">{field.value.name}</p>
                    <p className="text-xs underline">Click to change</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-sm">Upload PDF</span>
                  </>
                )}

                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          />

          {/* Language */}
          <Controller
            name="language"
            control={control}
            rules={{ required: "Language is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages?.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500"
          >
            Add PDF
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPdfModal;
