"use client";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import Form_ from "@/components/form/form";
import { FormField } from "@/types/resources";
import { LoginUser } from "@/validation";
import ErrorMessage from "@/app/(auth)/_components/error-message";
import Link from "next/link";

type Signin = {
  name: string;
  email: string;
  password: string;
};

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const login = async (formData: Signin) => {
    const { email, password } = formData;
    setIsLoading(true);
    const { error, data } = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error?.message) {
      setIsLoading(false);
      setErrorMessage(error.message);
    } else if (data) {
      setIsLoading(false);
      router.push("/dashboard");
    }
    return { message: "Success" };
  };

  /*const signinGoogle = async () => {
    const data = await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
      disableRedirect: true,
    });

    if (data.data?.url) {
      router.push(data.data.url);
    }
  };

  const signinGithub = async () => {
    const data = await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
      disableRedirect: true,
    });
    if (data.data?.url) {
      router.push(data.data.url);
    }
  };*/

  const fields: FormField[] = [
    {
      name: "email",
      type: "text",
      label: "Emailova addressa",
      className: "h-[42px]",
    },
    {
      name: "password",
      type: "password",
      label: "Heslo",
      className: "h-[42px]",
    },
  ];

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-100 flex items-center justify-center flex-col gap-6"
      )}
    >
      {isLoading && <Loader />}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Prihlásiť sa do účtu
          </h1>
          <p className="text-gray-600">
            Prosim vyplňte nasledovné údaje pre prihlásenie
          </p>
        </div>
        <Form_<Signin> fields={fields} action={login} validation={LoginUser}>
          {({ fields }) => (
            <div className="flex flex-col gap-4">
              {fields.email}
              {fields.password}

              {errorMessage && <ErrorMessage message={errorMessage} />}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
              >
                Prihlasit sa
              </button>
              <p className="text-center">
                Este nemas vytvoreny ucet ?{" "}
                <Link href="/signup" className="text-blue-600">Registruj sa tu</Link>
              </p>
            </div>
          )}
        </Form_>
      </div>
    </div>
  );
}
