"use client";
import { resetPassword } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import ErrorMessage from "../_components/error-message";
import SuccessMessage from "../_components/success-message";
import Link from "next/link";

type ResetPassword = { password: string };

export default function ResetPasswordPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPassword>();

  const onResetPassword = async (formData: ResetPassword) => {
    const { password } = formData;
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setErrorMessage('An error has occured');
      return;
    }
    const { data, error } = await resetPassword({
      newPassword: password,
      token: token!,
    });
    
    if (error?.message) {
      setErrorMessage(error.message);
    }

    if (data?.status === true) {
      setSuccessMessage('Password successfully changed.');
      reset();
      setTimeout(() => router.push('/sigin'), 2000)
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-100 flex items-center justify-center flex-col gap-6"
      )}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Reset password?</h1>
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              href="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login here
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onResetPassword)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              id="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 mt-1">Field is required *</p>
            )}
          </div>

          {errorMessage && <ErrorMessage message={errorMessage} />}
          {successMessage && <SuccessMessage message={successMessage} />}

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
            >
              Reset password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
