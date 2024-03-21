"use client";

import { useState, FormEvent, ChangeEvent, useEffect, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

import Unauthorized from "../../components/Unauthorized";
import Footer from "../../components/Footer";
import {
  UserInterface,
  RegisterFormInterface,
} from "../../../types/interfaces";

const INITIAL_FORM_DATA: RegisterFormInterface = {
  name: "",
  password: "",
  confirmPassword: "",
  error: null,
};

/**
 * Admin dashboard for siging up and viewing user accounts.
 *
 * props: none
 *
 * state:
 *  -formData - object like {username: "user", password: "password", ..., errors: null}
 *  -users - array of objects like [{name: "guest"}, ...]
 *
 */
export default function RegisterForm() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [users, setUsers] = useState<UserInterface[]>([]);

  /** Load users from DB on mount */
  useEffect(() => {
    getUsers();
  }, []);

  /** Get users from DB and update users state */
  async function getUsers() {
    const res = await fetch("api/users", {
      method: "GET",
    });
    const users = await res.json();
    setUsers(users);
  }

  /** Update form input. */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const input = evt.target;
    setFormData((formData) => ({
      ...formData,
      [input.name]: input.value,
    }));
  }

  /** Register user in DB */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
        }),
      });

      if (res.ok) {
        setFormData(INITIAL_FORM_DATA);
        getUsers();
      } else {
        setFormData((formData) => ({
          ...formData,
          password: "",
          confirmPassword: "",
          error: "User already exists",
        }));
      }
    } catch (err) {
      console.log("Error during registration ", err);
    }
  }

  /** Delete user from DB */
  async function handleDelete(evt: MouseEvent<HTMLButtonElement>) {
    const target = evt.target as HTMLButtonElement;
    const id = target.id;

    try {
      const res = await fetch("api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: id,
        }),
      });

      if (res.ok) {
        getUsers();
      }
    } catch (err) {
      console.log("Error during deletion ", err);
    }
  }

  if (session?.user?.role !== "admin" && status === "authenticated") {
    return <Unauthorized />;
  }

  return (
    <div className="logged-in relative">
      {session?.user?.role === "admin" && status === "authenticated" && (
        <div className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-evenly" data-testid="register-form">
          <div className="mt-20">
            <h3 className="text-2xl mb-4">Register a new user:</h3>
            {formData.error && (
              <div className="bg-red-500 px-2 py-2 mb-2 rounded-lg">
                {formData.error}
              </div>
            )}
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label htmlFor="SignupForm-username">Username</label>
              <input
                id="SignupForm-name"
                className="border border-black my-1 py-1 px-1 rounded-lg"
                name="name"
                onChange={handleChange}
                value={formData.name}
                aria-label="Name"
              />
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
              <label htmlFor="SignupForm-password-confirm">
                Re-enter password
              </label>
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
                disabled={formData.password !== formData.confirmPassword || formData.name === "" || formData.password === ""}
              >
                Submit
              </button>
            </form>
          </div>
          <div className="mt-20">
            <h3 className="mb-4 text-2xl">Registered Guest Accounts:</h3>
            {users.length > 0 ? (
              <ol className="list-disc mx-10">
                {users?.map((user) => (
                  <li className="text-lg my-2" id={user.name} key={uuidv4()}>
                    {user.name}
                    <button
                      className="mx-4 bg-sky-900 hover:bg-sky-700 text-white font-bold px-4 rounded-lg"
                      id={user.name}
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-lg">No registered users</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
