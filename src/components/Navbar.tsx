"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

/** Navbar
 * 
 * State: 
 *  -isOpen: true/false
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const currentRoute = usePathname();
  const router = useRouter();

  const activeLinkStyle = "underline";
  const inactiveLinkStyle = "font-normal hover:underline";

  /** Log out user */
  async function logOut() {
    await signOut({ redirect: false, callbackUrl: "/" });
    router.replace("/");
  }

  return (
    <nav className="text-white bg-sky-900">
      <h1 className="nav-title flex justify-center font-rockSalt font-bold text-2xl sm:text-3xl md:text-5xl">
        <Link href={"/"}>
          <Image
            src={"/photos/deck-logo.jpeg"}
            alt="Deck Logo"
            width={75}
            height={75}
            style={{height: "auto"}}
            className="nav-image inline rounded w-[60px] sm:w-[75px]"
          />{" "}
          Island Adventures
        </Link>
      </h1>
      <hr className="border-1 border-black" />
      {session?.user?.name && status === "authenticated" && (
        <>
          <div className="nav-toggle hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center px-3 py-2 rounded hover:bg-sky-700"
            >
              <svg
                className={`fill-current h-7 w-7 ${
                  isOpen ? "hidden" : "block"
                }`}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
              <svg
                className={`fill-current h-7 w-7 ${
                  isOpen ? "block" : "hidden"
                }`}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
              </svg>
            </button>
          </div>
          <div
            className={`nav-links w-full flex-grow ${
              isOpen ? "block text-center" : "hidden"
            }`}
          >
            <div className="text-base p-2" data-testid="nav-links">
              <Link
                href={"/location"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/location"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                LOCATION
              </Link>
              <Link
                href={"/photos"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/photos"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                PHOTOS
              </Link>
              <Link
                href={"/reviews"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/reviews"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                REVIEWS
              </Link>
              <Link
                href={"/rates"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/rates"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                RATES
              </Link>
              <Link
                href={"/availability"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/availability"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                AVAILABILITY
              </Link>
              <Link
                href={"/rental-agreement"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/rental-agreement"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                RENTAL AGREEMENT
              </Link>
              <Link
                href={"/rental-guide"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/rental-guide"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                RENTAL GUIDELINES
              </Link>
              <Link
                href={"/contact"}
                className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                  currentRoute === "/contact"
                    ? activeLinkStyle
                    : inactiveLinkStyle
                }`}
                onClick={() => setIsOpen(false)}
              >
                CONTACT
              </Link>
              {session?.user?.role === "admin" && (
                <Link
                  href={"/admin"}
                  className={`nav-link block mt-4 inline-block lg:mt-0 text-white-200 lg:mr-4 ${
                    currentRoute === "/admin"
                      ? activeLinkStyle
                      : inactiveLinkStyle
                  }`}
                  onClick={() => setIsOpen(false)}
                  data-testid="nav-admin"
                >
                  ADMIN
                </Link>
              )}
              <button
                className="mt-4 lg:mt-0 bg-white hover:bg-sky-700 hover:text-white text-sky-900 font-bold px-4 rounded-lg"
                onClick={() => logOut()}
              >
                SIGN OUT
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
