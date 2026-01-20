/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { TProject } from "@/types/redux/project";

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
  }),
  overrideExisting: false,
});

export const {
  useUpdateProjectMutation,
  useCreateProjectMutation,
  useUpdatePrivacyPoliciesMutation,
  useDeletePrivacyPolicyMutation,
} = dashboardWriteApi;
