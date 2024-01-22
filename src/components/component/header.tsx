import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { SVGProps, useEffect, useState } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------------------------------------------- //

interface headerProps {}

// ---------------------------------------------------------------------------------------------------------------- //

const Header: React.FC<headerProps> = ({}) => {
  // -------------------------------------------------------------------------------------------------------------- //
  // check the rote for setting the tab
  const router = useRouter();
  let activeTab = "";
  if (router.pathname === "/settings") {
    activeTab = "Settings";
  } else if (router.pathname.includes("/domain")) {
    activeTab = "Domains";
  } else if (router.pathname === "/") {
    activeTab = "Overview";
  }
  // ---------------------------------------------------------------------------------------------------------------- //
  // when session object is changed update the user profile image
  const [profilePic, setProfilePic] = useState("");
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session?.user?.image) setProfilePic(session.user.image);
  }, [session]);

  // ----------------------------------------------------------------------------------------------------------------- //
  return (
    <header className="sticky top-0 z-10 bg-transparent backdrop-blur px-4 lg:px-6  flex items-center border-b bg-gray-50">
      {/* icon */}
      <Link className="flex items-center justify-center mr-8" href="/">
        <CloudIcon className="h-6 w-6" />
        <span className="sr-only">Vercel</span>
      </Link>
      {/* tabs */}
      <div className="border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <Link
              href="/"
              className={`inline-flex items-center justify-center p-4  border-b-2  rounded-t-lg ${
                activeTab === "Overview"
                  ? "text-blue-600 border-b-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300"
              }   dark:text-blue-500 dark:border-blue-500 group`}
              aria-current="page"
            >
              <DashboardIcon
                className={`w-4 h-4 me-2 ${
                  activeTab === "Overview"
                    ? "text-blue-600"
                    : " text-gray-400 group-hover:text-gray-500"
                }   dark:text-blue-500`}
              />
              Overview
            </Link>
          </li>
          <li className="me-2">
            <Link
              href="/settings"
              className={`inline-flex items-center justify-center p-4  border-b-2  rounded-t-lg ${
                activeTab === "Settings"
                  ? "text-blue-600 border-b-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300"
              }   dark:text-blue-500 dark:border-blue-500 group`}
            >
              <SettingsIcon
                className={`w-4 h-4 me-2 ${
                  activeTab === "Settings"
                    ? "text-blue-600"
                    : " text-gray-400 group-hover:text-gray-500"
                }   dark:text-blue-500`}
              />
              Settings
            </Link>
          </li>
          <li className="me-2">
            <Link
              href="/domains"
              className={`inline-flex items-center justify-center p-4  border-b-2  rounded-t-lg ${
                activeTab === "Domains"
                  ? "text-blue-600 border-b-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300"
              }   dark:text-blue-500 dark:border-blue-500 group`}
            >
              <DomainsIcon
                className={`w-4 h-4 me-2 ${
                  activeTab === "Domains"
                    ? "text-blue-600"
                    : " text-gray-400 group-hover:text-gray-500"
                }   dark:text-blue-500`}
              />
              Domains
            </Link>
          </li>
        </ul>
      </div>
      {/* right end */}
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="hidden md:block text-sm my-auto font-medium hover:underline underline-offset-8"
          href="https://vercel.com/docs/projects/domains/managing-dns-records"
        >
          Docs
        </Link>
        {/* signin or userprofileAvatar */}
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                size="icon"
                variant="ghost"
              >
                {profilePic ? (
                  <img
                    alt={""}
                    className="rounded-full"
                    height="32"
                    src={profilePic}
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width="32"
                  />
                ) : (
                  <UserIcon />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/settings"} className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                }}
                className="cursor-pointer w-full hover:bg-gray-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/signin"
          >
            Login / Sign Up
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;

function CloudIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function DashboardIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 18"
    >
      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
    </svg>
  );
}

function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
    </svg>
  );
}

function DomainsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 20"
    >
      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
    </svg>
  );
}
function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
