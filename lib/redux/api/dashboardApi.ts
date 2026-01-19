/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AdminDashboardResponse,
  LatestUser,
  UserListResponse,
} from "@/types/redux/dashboard_over-view";
import { baseApi } from "./baseApi";
import { DonationsResponse } from "@/types/redux/donation";
import { TProject, TProjectRes } from "@/types/redux/project";

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
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminOverviewQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetDonationsQuery,
  useGetProjectsQuery,
  useGetProjectDetailsQuery,
} = dashboardApi;
