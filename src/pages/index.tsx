import { Inter } from "next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/component/header";
import Homepage from "@/components/component/homepage";
import Footer from "@/components/component/footer";

// --------------------------------------------------------------------------------------------------- //

interface homeProps {}

// --------------------------------------------------------------------------------------------------- //

const Home: React.FC<homeProps> = ({}) => {

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

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
