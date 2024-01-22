import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSession, signIn, useSession } from "next-auth/react";
import { google_mark, apple_mark, undraw_secure, login } from "./../public";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";
import {config} from '../../Constants'

// ------------------------------------------------------------------------------------------------------------ //

interface signinProps {}

interface SigninFormData {
  email: string;
  password: string;
}

// ------------------------------------------------------------------------------------------------------------- //

const Signin: React.FC<signinProps> = ({}) => {
  // whenever the page reloaded or session changed this fucntion will check user.
  // redirect to home page if loggedin
  // const session = await getServerSession(authOptions as any);
  // if(session) redirect("/");

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormData>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  //onsubmission of form login if no account then signin
  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const notn = toast.loading("creating Your account")
    try {
      const { email } = formData;
      const resUserExists = await fetch(`${config.url}/api/user/exists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const {user} = await resUserExists.json();
      if (user) {
        setError("email already in use");
        toast.error("email id already exists",{id:notn});
        return;
      }

      const res = await fetch(`https://dns-manager-seven.vercel.app/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("account created, login to your account",{id:notn})
        console.log("user created");
        reset();
        router.replace("/login");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("User creation error",{id:notn});
    }
  });

  // signin with google provider
  const signinWithGoogleProvider = async () => {
    const notn = toast.loading("Signing you in")
    const res = await signIn("google", { callbackUrl: "/" });
    if(res?.ok){
      toast.success("Signed In",{id:notn});
    }else if(res?.error){
      toast.error("Error occured while signing in",{id:notn});
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* left half  */}
      <div
        className="hidden md:flex items-center justify-center w-2/4  bg-[url('../public/login.png')]  overflow-hidden text-white text-7xl font-bold 
    "
      >
        <Image alt="" src={login} className=""></Image>
      </div>
      {/* right half */}
      <div className="bg-[#F5F5F5] flex-1 flex justify-center items-center">
        <div>
          {/* Signin Text */}
          <p className="text-4xl font-bold mb-1">Sign In</p>
          <p className="font-normal text-base text-black mb-6">
            Sign in to your account
          </p>
          {/* Signin provider buttons */}
          <div className="flex space-x-5 mb-6">
            <div
              onClick={signinWithGoogleProvider}
              className="bg-white p-2 px-4 flex items-center justify-center space-x-4m  rounded-[10px] space-x-2 cursor-pointer hover:bg-[#B5B5B5]"
            >
              <div className="relative w-3.5 h-3.5">
                <Image src={google_mark} fill className="" alt={""} />
              </div>
              <p className="font-normal text-xs text-[#858585]">
                Signin in with Google
              </p>
            </div>

            <div className="bg-white p-2 px-4 flex items-center justify-center space-x-4m rounded-[10px] space-x-2 cursor-not-allowed">
              <div className="relative w-3.5 h-3.5">
                <Image src={apple_mark} fill className="" alt={""} />
              </div>
              <p className="font-normal text-xs text-[#858585]">
                Signin in with Apple
              </p>
            </div>
          </div>
          {/* Signin form */}
          <form
            onSubmit={onSubmit}
            className="p-5 bg-white rounded-2xl space-y-4"
          >
            <div className="space-y-2 w-full">
              <label htmlFor="email_address" className="text-base font-medium">
                Email address
              </label>
              <input
                type="email"
                id="email_address"
                {...register("email", { required: true })}
                className="w-full p-2 px-3 text-sm font-medium rounded-[10px] bg-[#F5F5F5] outline-none focus:ring-1"
                placeholder="abcd@gmail.com"
              />
            </div>
            <div className="space-y-2 w-full">
              <label htmlFor="password" className="text-base font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: true,
                  minLength: 8,
                  maxLength: 32,
                })}
                className="w-full p-2 px-3 text-sm font-medium rounded-[10px] bg-[#F5F5F5] outline-none focus:ring-1 placeholder:opacity-50"
                placeholder="◾◾◾◾◾◾◾◾"
              />
            </div>

            <p className="text-[#346BD4] text-base ">Forgot password?</p>

            <button
              type="submit"
              className="bg-black rounded-xl w-full text-white font-bold text-base p-2"
            >
              Sign In
            </button>
          </form>

          <p className="text-[#858585] text-sm text-center p-2">
            already have an account?{" "}
            <Link href={"/login"}>
              <span className="text-[#346BD4]">Login here</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Signin;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
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
