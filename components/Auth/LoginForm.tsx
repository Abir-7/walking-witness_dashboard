/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useDispatch } from "react-redux";

import { loginValidationSchema } from "@/lib/formDataValidation";
import { useLoginMutation } from "@/lib/redux/api/authApi";
import z from "zod";

import { setToken } from "@/lib/redux/features/authSlice";
type LoginFormData = z.infer<typeof loginValidationSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: { email_address: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log(data);
    try {
      const response = await login({
        email_address: data.email_address,
        password: data.password,
      }).unwrap();

      if (response?.role !== "admin") {
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
          duration: 3000,
        });
        return;
      }

      dispatch(setToken(response.access_token));

      // console.log({
      //   userId: response.user_id,
      //   role: response.role,
      //   accessToken: response.access_token,
      //   refreshToken: response.refresh_token,
      // });

      toast.success("Login successful!", {
        description: `Welcome back, ${data.email_address}!`,
        duration: 2000,
      });

      router.push("/overview");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description:
          error?.data?.message ||
          "Please check your credentials and try again.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-primary dark:bg-primary-dark">
      <div className="flex-1 bg-primary dark:bg-primary-dark flex items-center justify-center p-4 sm:p-6 lg:p-8 order-1 lg:order-2">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl lg:rounded-4xl bg-white dark:bg-gray-800">
          <div className="w-full flex justify-center items-center mb-4">
            <Image src="/icons/logo.svg" alt="logo" width={120} height={120} />
          </div>

          <CardHeader className="text-center">
            <h2 className="text-lg sm:text-2xl text-primary dark:text-white">
              Welcome Back!
            </h2>
          </CardHeader>
          <CardHeader className="text-center my-2">
            <h2 className="text-lg text-secondary">
              Enter your email and password to access your account.
            </h2>
          </CardHeader>

          <form
            className="space-y-4 sm:space-y-3 px-2 sm:px-4 lg:px-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-foreground text-sm sm:text-base font-semibold block"
              >
                Email
              </label>
              <div className="relative">
                <Input
                  id="email_address"
                  type="text"
                  placeholder="Enter your email"
                  className={`pl-4 pr-10 h-10 sm:h-12 rounded-md text-sm sm:text-base ${
                    errors.email_address
                      ? "border-error focus:border-error"
                      : "input-focus"
                  }`}
                  {...register("email_address")}
                  disabled={isLoading}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
              {errors.email_address && (
                <p className="text-error text-xs mt-1">
                  {errors.email_address.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-foreground text-sm sm:text-base font-semibold block"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`pl-4 pr-10 h-10 sm:h-12 rounded-md text-sm sm:text-base ${
                    errors.password
                      ? "border-error focus:border-error"
                      : "input-focus"
                  }`}
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end mb-2">
              <Link
                href="/forgot-password"
                className="text-red font-semibold text-xs sm:text-sm hover:text-red hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-12 bg-gradient-red hover:bg-gradient-red-hover text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base"
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
