"use client";
import { signUp } from "@/lib/auth-client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import Form_ from "@/components/form/form";
import { FormField } from "@/types/resources";
import { getCityOptions, regionOptions } from "@/lib/countries";
import { RegisterUser } from "@/validation";
import ErrorMessage from "@/app/(auth)/_components/error-message";
import { saveUserLocation } from "@/actions/user-info";

type Signup = {
  name: string;
  email: string;
  password: string;
  gender: string;
  dob: Date;
  country: string;
  region: string;
  city: string;
};

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onRegister = async (formData: Signup) => {
    const { email, password, name, gender, dob, country, region, city } =
      formData;
    setIsLoading(true);
    const { error, data } = await signUp.email({
      email,
      password,
      name,
      gender,
      dob,
      callbackURL: "/dashboard",
    });

    console.log(error);
    if (error?.message) {
      setErrorMessage(error.message);
    } else if (data) {
      console.log("d", data);
      await saveUserLocation(data.user.id, country, region, city);
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
    { name: "name", type: "text", label: "Krstne meno", className: "h-[42px]" },
    {
      name: "gender",
      type: "select",
      label: "Pohlavie",
      className: "h-[42px]",
      options: [
        { label: "Muz", value: "man" },
        { label: "Zena", value: "woman" },
      ],
    },
    {
      name: "dob",
      type: "date-picker",
      label: "Datum narodenia",
      className: "h-[42px]",
    },
    {
      name: "email",
      type: "text",
      label: "Emailova addressa",
      className: "h-[42px]",
    },
    {
      name: "password",
      type: "password",
      label: "Heslo pre prihlasenie",
      className: "h-[42px]",
    },
    {
      type: "cascader",
      name: "country-input",
      fields: [
        {
          type: "select",
          name: "country",
          label: "Krajina",
          populate: "region",
          onChange: (country: string) => {
            return country === "SK" ? regionOptions : [];
          },
          options: [
            { label: "Všetky krajiny", value: "all" },
            { label: "Česko", value: "CZ" },
            { label: "Slovensko", value: "SK" },
            { label: "Zahraničie - Rakusko", value: "UTA" },
          ],
        },
        {
          type: "select",
          name: "region",
          populate: "city",
          label: "Region",
          options: [],
          onChange: (region: string) => {
            return getCityOptions(region);
          },
        },
        { type: "select", name: "city", label: "Mesto", options: [] },
      ] as FormField[],
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
            Vytvorit novy ucet
          </h1>
          <p className="text-gray-600">
            Prosim vyplnte nasledovne udaje pre registraciu
          </p>
        </div>
        <Form_<Signup>
          fields={fields}
          action={onRegister}
          validation={RegisterUser}
          data={{ country: "SK" }}
        >
          {({ fields }) => (
            <div className="flex flex-col gap-4">
              {fields.name}

              <div className="flex gap-4">
                <div className="flex-1">{fields.gender}</div>
                <div className="flex-1">{fields.dob}</div>
              </div>
              <div className="border border-dashed border-gray-300 p-3">
                {fields["country-input"]}
              </div>
              {fields.email}
              {fields.password}

              {errorMessage && <ErrorMessage message={errorMessage} />}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
              >
                Vytvorit ucet
              </button>
            </div>
          )}
        </Form_>
      </div>
    </div>
  );
}
