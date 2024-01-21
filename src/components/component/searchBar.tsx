import { domainType } from "@/util/functions";
import React, { Dispatch, SVGProps, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------------------------------------------- //

interface searchBarProps {
    setDomains: React.Dispatch<React.SetStateAction<domainType[] | undefined>>
}

type serchBarFormData = {
  query: string;
};

// ----------------------------------------------------------------------------------------------------------- //

const SearchBar: React.FC<searchBarProps> = ({setDomains}) => {
  // ---------------------------------------------------------------------------------------------------------- //
  // search domains by name using regular expression in the backend
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<serchBarFormData>();

  const [loading, setLoading] = useState(false);
  
  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const notification = toast.loading("searching domains");
    try {
      setLoading(true);
      const res = await fetch(`https://dns-manager-seven.vercel.app/api/domain/query`, {
        method: "POST",
        headers: {
          ContentType: "application/json",
        },
        body: JSON.stringify({ query: formData.query }),
      });
      if (res.ok) {
        console.log("Domains fetched");
        const text = await res.json();
        console.log(text);
        setDomains(text);
        toast.success("domains fetched successfully",{id:notification});
        reset();
      }
    } catch (error:any) {
      alert(error.message)
      toast.error("error while fetching domains",{id:notification});
    }
    setLoading(false);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center max-w-screen-xl mx-auto my-8 p-8 "
    >
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <BranchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="text"
          {...register("query", { required: true })}
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search domain name..."
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <SearchIcon className="w-4 h-4" />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;

function BranchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
      />
    </svg>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
      />
    </svg>
  );
}
