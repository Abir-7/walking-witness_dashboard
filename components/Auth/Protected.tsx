/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser, setToken } from "@/lib/redux/features/authSlice";
import { useGetmeQuery } from "@/lib/redux/api/authApi";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Call getMe query only if token exists
  const { data, isLoading, isError } = useGetmeQuery(undefined, {
    skip: !token, // skip query if no token
  });

  // Handle token check & user state
  useEffect(() => {
    setMounted(true);

    if (!token) {
      router.push("/login");
      return;
    }

    if (data?.data?.id) {
      dispatch(
        setUser({
          user_id: data.data.id,
          user_email: data.data.email,
          user_name: data.data.full_name,
          user_role: data.data.role,
          avatar: data.data.avatar || null,
        }),
      ); // store user in Redux
    }

    if (isError) {
      // router.push("/login"); // token invalid or API failed
    }
  }, [token, data, isError, router, dispatch]);

  // Show nothing while loading or before hydration
  if (!mounted || !token || isLoading) return null;

  return <>{children}</>;
};

export default Protected;
