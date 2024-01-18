import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { Router,useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

interface homeProps {}

const Home: React.FC<homeProps> = ({}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // whenever the page reloaded or session changed this fucntion will check user.
  // redirect to signin page if not loggedin
  useEffect(() => {
    if(status !== 'loading' && !session?.user){
      router.replace('/signin');
    }
  
  }, [session]);
  

  return <>
  <h1>{"bkjj"}</h1>
  </>;
};

export default Home;
