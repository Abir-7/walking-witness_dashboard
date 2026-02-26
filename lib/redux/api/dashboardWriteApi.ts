import { use } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { TProject } from "@/types/redux/project";
interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface AddLanguageRequest {
  language_name: string;
}

export const dashboardWriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProject: builder.mutation<
      { message: string; data: TProject },
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/dashboard/project-details/${id}`,
        method: "PUT", // or PUT (match backend)
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
    createProject: builder.mutation<void, { body: FormData }>({
      query: ({ body }) => ({
        url: "/dashboard/projects",
        method: "POST",
        body,
      }),
    }),
    updatePrivacyPolicies: builder.mutation<
      any,
      { title: string; description: string }[]
    >({
      query: (policies) => ({
        url: "/settings/admin/privacy-policy",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: policies,
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),
    deletePrivacyPolicy: builder.mutation<void, number>({
      query: (id) => ({
        url: `/settings/admin/privacy-policy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),
    // boook
    uploadBook: builder.mutation({
      query: (formData: FormData) => ({
        url: "/books/upload",
        method: "POST",
        body: formData, // send FormData directly
      }),
    }),
    // content
    updateProgram: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/dashboard/program-details/${id}`,
        method: "PUT", // or POST depending on backend
        body: data, // send FormData directly
      }),
      invalidatesTags: ["Programs"],
    }),
    // User
    updatePersonalInfo: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/settings/personal-info/me",
        method: "PUT",
        body: formData, // FormData passed directly
      }),
      invalidatesTags: ["User"], // ensures getMe refetches
    }),
    changePassword: builder.mutation<any, ChangePasswordPayload>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body, // JSON body
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    addBookLanguage: builder.mutation<any, AddLanguageRequest>({
      query: (body) => ({
        url: "/books/add-language",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BookLanguages"],
    }),
    addCategory: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/dashboard/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    removeBookLanguage: builder.mutation<
      any,
      { bookId: number | string; lang: string }
    >({
      query: ({ bookId, lang }) => ({
        url: `/books/language/${bookId}?lang=${lang}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),
    addBookPdf: builder.mutation<
      any,
      { bookId: number | string; data: FormData }
    >({
      query: ({ bookId, data }) => ({
        url: `/books/details/${bookId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),
    softDeleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dashboard/categories/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    softDeleteLanguage: builder.mutation<void, number>({
      query: (id) => ({
        url: `/books/languages/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BookLanguages"], // refreshes language list after deletion
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateProjectMutation,
  useCreateProjectMutation,
  useUpdatePrivacyPoliciesMutation,
  useDeletePrivacyPolicyMutation,
  useUploadBookMutation,
  useUpdateProgramMutation,
  useUpdatePersonalInfoMutation,
  useChangePasswordMutation,
  useAddBookLanguageMutation,
  useAddCategoryMutation,
  useRemoveBookLanguageMutation,
  useAddBookPdfMutation,
  useSoftDeleteCategoryMutation,
  useSoftDeleteLanguageMutation,
} = dashboardWriteApi;
