"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const INITIAL_FORM_DATA = {
  password: "",
  confirmPassword: "",
  message: "",
  error: "",
};

require("dotenv").config();

/**
 * Password reset form
 *
 * Props:
 * -params: token (string)
 *
 * State:
 * -formData: {password: "", confirmPassword: "", message: "", error: ""}
 */
export default function ResetForm({ params }: { params: { token: string } }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const router = useRouter();

  /** Update form input. */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const input = evt.target;
    setFormData((formData) => ({
      ...formData,
      [input.name]: input.value,
    }));
  }

  /** Update user's password in DB */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/reset", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: params.token,
          password: formData.password,
        }),
      });

      if (res.ok) {
        console.log(await res.json());
        setFormData({
          ...INITIAL_FORM_DATA,
          message: "Password successfully reset",
        });
        setTimeout(() => router.replace("/"), 2000);
      } else {
        setFormData({ ...INITIAL_FORM_DATA, error: "Password reset failed" });
      }
    } catch (err) {
      setFormData({ ...INITIAL_FORM_DATA, error: "Password reset failed" });
    }
  }

  return (
    <div
      className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-evenly"
      data-testid="password-reset-form"
    >
      <div className="mt-20">
        {formData.error && (
          <div className="bg-red-500 px-2 py-2 mb-2 rounded-lg">
            {formData.error}
          </div>
        )}
        {formData.message && (
          <div className="bg-green-500 px-2 py-2 mb-2 rounded-lg">
            {formData.message}
          </div>
        )}
        <h3 className="text-2xl mb-4">Choose a new password:</h3>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="SignupForm-password">Password</label>
          <input
            id="SignupForm-password"
            className="border border-black my-1 py-1 px-1 rounded-lg"
            name="password"
            onChange={handleChange}
            value={formData.password}
            aria-label="Password"
            type="password"
          />
          <label htmlFor="SignupForm-password-confirm">Re-enter password</label>
          <input
            id="SignupForm-password-confirm"
            className="border border-black my-1 py-1 px-1 rounded-lg"
            name="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            aria-label="Confirm password"
            type="password"
          />
          {formData.password !== formData.confirmPassword && (
            <div className="text-red-500">Passwords do not match</div>
          )}
          <button
            className="bg-sky-900 self-start px-4 py-2 font-bold text-xl text-white hover:bg-sky-700 disabled:bg-gray-400 rounded-lg"
            disabled={
              formData.password !== formData.confirmPassword ||
              formData.password === ""
            }
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
