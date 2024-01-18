import Link from "next/link";
// import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import { JSX, SVGProps, useEffect } from "react";
import { Router, useRouter } from "next/router";
import Header from "@/components/component/header";
const inter = Inter({ subsets: ["latin"] });
import { Homepage } from "@/components/component/homepage";
import Footer from "@/components/component/footer";
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
    <div className="flex flex-col min-h-screen border-4">
      <Header />
      <section className="flex-1">
        <Homepage />
      </section>
      <Footer />
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
