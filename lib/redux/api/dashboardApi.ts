import { use } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AdminDashboardResponse,
  LatestUser,
  UserListResponse,
} from "@/types/redux/dashboard_over-view";
import { baseApi } from "./baseApi";
import { DonationsResponse } from "@/types/redux/donation";
import { TProject, TProjectRes } from "@/types/redux/project";
import { TBook, TContent } from "@/components/Dashboard/Upload/UploadsClient";

export interface GetBooksParams {
  search_term?: string;
  page?: number;
  limit?: number;
}

export interface GetContentsParams {
  search_term?: string;
  page?: number;
  limit?: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminDashboardResponse, void>({
      query: () => "/dashboard/admin-overview",
    }),

    // user page api
    getAllUsers: builder.query<
      UserListResponse,
      { page?: number; page_size?: number; search_term?: string }
    >({
      query: ({ page = 1, page_size = 4, search_term = "" } = {}) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("page_size", page_size.toString());
        if (search_term) params.append("search_term", search_term);

        return `/dashboard/user-list?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation<any, { user_id: string }>({
      query: (body) => ({
        url: "/dashboard/user-list",
        method: "DELETE",
        body, // { user_id }
      }),
      invalidatesTags: ["Users"],
    }),
    GetUserById: builder.query<{ data: LatestUser; message: string }, string>({
      query: (user_id) => `/dashboard/user-list?user_id=${user_id}`,
    }),

    // donation ----------------------
    getDonations: builder.query<
      DonationsResponse,
      { page?: number; page_size?: number; search_term?: string }
    >({
      query: ({ page = 1, page_size = 10, search_term = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("page_size", page_size.toString());
        if (search_term) params.append("search_term", search_term);
        return `/dashboard/donation?${params.toString()}`;
      },
    }),
    getProjects: builder.query<
      TProjectRes,
      { search_term?: string; page?: number; page_size?: number }
    >({
      query: ({ search_term = "", page = 1, page_size = 10 } = {}) => {
        const params = new URLSearchParams();
        if (search_term) params.append("search_term", search_term);
        params.append("page", page.toString());
        params.append("page_size", page_size.toString());

        return `/dashboard/projects?${params.toString()}`;
      },
    }),
    getProjectDetails: builder.query<TProject, number>({
      query: (id) => `/dashboard/project-details/${id}`,
      providesTags: ["Projects"],
    }),

    // program api
    getPrograms: builder.query<
      { id: number; name: string; image: string }[],
      void
    >({
      query: () => "/dashboard/programs",
      providesTags: ["Programs"],
    }),
    // category api
    getCategories: builder.query<
      { id: number; name: string; image: string }[],
      void
    >({
      query: () => "/dashboard/categories",
      providesTags: ["Categories"],
    }),
    // privecy api
    getPrivacyPolicies: builder.query<{ privacy: string; id: number }, void>({
      query: () => "/settings/admin/privacy-policy",
      providesTags: ["PrivacyPolicy"],
    }),
    // content api
    getContents: builder.query<
      { data: TContent[]; total_pages: number; current_page: number },
      GetContentsParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.search_term)
          searchParams.append("search_term", params.search_term);
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("page_size", params.limit.toString());
        const queryString = searchParams.toString();
        return `/dashboard/program-details${queryString ? `?${queryString}` : ""}`;
      },
    }),
    getProgram: builder.query<TContent, string>({
      query: (id) => `dashboard/program-details/${id}`,
      providesTags: ["Programs"],
    }),
    // book api
    getBooks: builder.query<
      { data: TBook[]; total_pages: number; current_page: number },
      GetBooksParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search_term)
          searchParams.append("search_term", params.search_term);
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("page_size", params.limit.toString());
        const queryString = searchParams.toString();
        return `/books/list-admin${queryString ? `?${queryString}` : ""}`;
      },
    }),
    getBook: builder.query<TBook, string>({
      query: (id) => `/books/details/${id}`,
      providesTags: ["Books"],
    }),
    getBookLanguages: builder.query<
      { id: number; code: string; name: string }[],
      void
    >({
      query: () => ({
        url: "/books/languages-lsit",
        method: "GET",
      }),
      providesTags: ["BookLanguages"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminOverviewQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetDonationsQuery,
  useGetProjectsQuery,
  useGetProjectDetailsQuery,
  useGetProgramsQuery,
  useGetCategoriesQuery,
  useGetPrivacyPoliciesQuery,
  useGetContentsQuery,
  useGetBooksQuery,
  useGetBookQuery,
  useGetProgramQuery,
  useGetBookLanguagesQuery,
} = dashboardApi;
