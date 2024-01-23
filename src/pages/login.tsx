import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { login } from "../public";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

// ----------------------------------------------------------------------------------------------------------------------------------------------- //

interface signinProps {}

interface SigninFormData {
  email: string;
  password: string;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------ //

const Login: React.FC<signinProps> = ({}) => {
  const [error, setError] = useState("");
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormData>();
  const router = useRouter();
  const { data: session, status } = useSession();

  //onsubmission of form login
  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    // alert("Credential signin is not supported. please use signin with Google🔧🛠️")
    const notn = toast.loading("Logging in");
    try {
      const { email, password } = formData;
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log(res);
      if (res?.ok) {
        toast.success("Logged in", { id: notn });
        router.replace("/");
        return;
      }
      // setError(res?.error);
      toast.error("invalid credentials", { id: notn });
      console.log(res?.error);
    } catch (error: any) {
      console.log(error);
      toast.error("error occured while Login", { id: notn });
    }
  });

// -------------------------------------------------------------------------------------------------------------------------------------------- //
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
          {/* Login Text */}
          <p className="text-4xl font-bold mb-1">Welcome back</p>
          <p className="font-normal text-base text-black mb-6">
            Log in to your account
          </p>
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
                {...register("email", { required: "Enter email id" })}
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
                  required: "Enter email id",
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
              Log In
            </button>
          </form>

          <p className="text-[#858585] text-sm text-center p-2">
            Don't have an account?{" "}
            <Link href={"/signin"} className="">
              <span className="text-[#346BD4]">Register here</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
