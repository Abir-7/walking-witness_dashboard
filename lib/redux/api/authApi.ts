import { baseApi } from "./baseApi"; // your existing baseApi

import { GetMeResponse, LoginRequest, LoginResponse } from "@/types/redux/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
    }),
    getme: builder.query<GetMeResponse, void>({
      query: () => "/settings/personal-info/me",
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components
export const { useLoginMutation, useGetmeQuery } = authApi;
