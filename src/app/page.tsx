"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LoginForm from "../components/LoginForm";

/** Homepage
 * State:
 *  -logInClicked: false/true
 *
 *  Home -> LoginForm
 */
export default function Home() {
  const [logInClicked, setLogInClicked] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      {session?.user?.name && status === "authenticated" ? (
        <div className="home-loggedIn-small md:home-loggedIn bg-cover bg-[url('/photos/sunset-lighthouse.jpg')]"></div>
      ) : (
        <div className="home-loggedIn-small md:home-loggedIn bg-cover bg-[url('/photos/sunset-lighthouse.jpg')]">
          <div className="flex flex-col items-center">
            <div className="mt-10 mb-10 text-4xl text-white text-shadow-lg shadow-black font-bold">
              Welcome!
            </div>
            {logInClicked === false && (
              <button
                className="bg-sky-900 px-8 py-4 font-bold text-xl text-white hover:bg-sky-700 rounded-lg"
                onClick={() => setLogInClicked(true)}
                data-testid="login-btn"
              >
                Log In
              </button>
            )}
            {logInClicked && <LoginForm />}
          </div>
        </div>
      )}
    </>
  );
}
