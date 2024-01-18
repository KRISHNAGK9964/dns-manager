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
    <div className="flex flex-col min-h-screen ">
      <Header />
      <section className="flex-1">
        <Homepage />
      </section>
      <Footer />
    </div>
  );
};

export default Home;
