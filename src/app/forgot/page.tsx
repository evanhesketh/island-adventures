"use client";

import { useState, FormEvent, ChangeEvent, useEffect, MouseEvent } from "react";

const INITIAL_FORM_DATA = { email: "", message: "", loading: false };

/**
 * Password reset form
 *
 * Props:
 * -none
 *
 * State:
 * -formdata: {email: "", message: ""}
 */
export default function ForgotPassword() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  /** Update form input. */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const input = evt.target;
    setFormData((formData) => ({
      ...formData,
      [input.name]: input.value,
    }));
  }

  /** Send password reset link */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setFormData({ ...formData, loading: true });
    try {
      const res = await fetch("api/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      if (res.ok) {
        setFormData({
          ...INITIAL_FORM_DATA,
          message: `If a matching account was found, 
          an email was sent to ${formData.email} 
          to allow you to reset your password`,
        });
      } else {
        setFormData({
          ...INITIAL_FORM_DATA,
          message: `If a matching account was found, 
          an email was sent to ${formData.email} 
          to allow you to reset your password`,
        });
      }
    } catch (err) {}
  }

  return (
    <div
      className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-evenly"
      data-testid="password-forgot-form"
    >
      <div className="mt-20 w-72">
        <h3 className="text-2xl mb-4">Enter your email address:</h3>
        {formData.message && (
          <div className="bg-green-500 px-2 py-2 mb-2 rounded-lg">
            {formData.message}
          </div>
        )}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            id="ForgotForm-email"
            className="border border-black my-1 py-1 px-1 rounded-lg"
            name="email"
            onChange={handleChange}
            value={formData.email}
            aria-label="Email"
          />
          <button
            className="bg-sky-900 self-start px-4 py-2 font-bold text-xl text-white hover:bg-sky-700 disabled:bg-gray-400 rounded-lg"
            disabled={formData.email === "" || formData.loading}
          >
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}
