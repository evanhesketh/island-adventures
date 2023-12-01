"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

/**
 * Form for logging in a user.
 *
 * state:
 *  -formData - object like {username: "user", password: "password"}
 *  -error - string
 *
 */

const INITIAL_FORM_DATA = { name: "", password: "" };

export default function LoginForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { name, password } = formData;

  /** Update form input. */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const input = evt.target;
    setFormData((formData) => ({
      ...formData,
      [input.name]: input.value,
    }));
  }

  /** Redirect home on success, otherwise show errors */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        name,
        password,
        redirect: false,
      });

      if (res?.error) {
        setFormData(INITIAL_FORM_DATA);
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    router.replace("/");
  }

  return (
    <div className="">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col">
        <form className="flex flex-col" onSubmit={handleSubmit} data-testid="login-form">
          {error && (
            <div className="bg-red-500 text-white px-2 py-2 mb-2 rounded-lg">
              {error}
            </div>
          )}
          <input
            className="border border-black my-1 py-1 px-1 rounded-lg"
            id="LoginForm-username"
            name="name"
            onChange={handleChange}
            value={formData.name}
            placeholder="Username"
            aria-label="Name"
          />
          <input
            className="border border-black my-1 py-1 px-1 rounded-lg"
            id="LoginForm-password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
            aria-label="Password"
            type="password"
          />
          <button className="bg-sky-900 self-center px-4 py-2 font-bold text-xl text-white hover:bg-sky-700 rounded-lg">
            Submit
          </button>
        </form>
         <button className="bg-sky-900 self-center mt-2 px-2 text-sm text-white hover:bg-sky-700 rounded-lg"
         onClick={() => router.replace("/forgot")}>
         Forgot Password
       </button>
       </div>
      )}
    </div>
  );
}
