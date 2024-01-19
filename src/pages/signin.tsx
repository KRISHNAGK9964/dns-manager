import React, { useEffect } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { google_mark, apple_mark, undraw_secure, login } from "./../public";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface signinProps {}

interface SigninFormData {
  email: string;
  password: string;
}
const Signin: React.FC<signinProps> = ({}) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>();
  const router = useRouter();
  const { data: session, status } = useSession();

  //onsubmission of form login if no account then signin
  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  // signin with google provider
  const signinWithGoogleProvider = async () => {
    const res = await signIn("google", { callbackUrl: "/" });
  };

  // whenever the page reloaded or session changed this fucntion will check user.
  // redirect to home page if loggedin
  // useEffect(() => {
  //   if(status !== 'loading' && session?.user){
  //     router.replace('/');
  //   }

  // }, [session]);

  return (
    <div className="flex min-h-screen">
      {/* left half  */}
      <div
        className="hidden md:flex items-center justify-center w-2/4  bg-[url('../public/login.png')]  overflow-hidden text-white text-7xl font-bold 
    "
      >
        <Image alt="" src={login} className=""></Image>
        {/* <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
          <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
            <Image
              src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen.png"
              className="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl"
              alt={""}
              fill={true}
            />
            <Image
              src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen-dark.png"
              className="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg"
              alt={""}
              fill={true}
            />
          </div>
        </div> */}
        {/* <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
        </div> */}
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
            Don't have an account?{" "}
            <span className="text-[#346BD4]">Register here</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Signin;
