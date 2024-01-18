import Link from "next/link";
// import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import { JSX, SVGProps, useEffect } from "react";
import { Router, useRouter } from "next/router";
import Header from "@/components/component/header";
const inter = Inter({ subsets: ["latin"] });
import { Kfk } from "@/components/component/kfk";
import { Homepage } from "@/components/component/homepage";
interface homeProps {}

const Home: React.FC<homeProps> = ({}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // whenever the page reloaded or session changed this fucntion will check user.
  // redirect to signin page if not loggedin
  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      router.replace("/signin");
    }
  }, [session]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 ">
        
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Vercel Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/19ZGqktdArp
 */

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
