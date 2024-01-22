import Header from "@/components/component/header";
import SearchBar from "@/components/component/searchBar";
import { useRouter } from "next/router";
import React, { SVGProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";
import { config } from "../../Constants";

// ------------------------------------------------------------------------------------------------ //

interface domainsProps {}
type DomainModalFormData = {
  domain: string;
};

type domainType = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// ------------------------------------------------------------------------------------------------ //

const domains: React.FC<domainsProps> = () => {
  const router = useRouter();

  // ---------------------------------------------------------------------------------------------- //
  // fetch All Domains whenever loading state changes(i,e when we perform some operation on database we change loading intentionally to refetch All domains)
  const [domains, setDomains] = useState<Array<domainType>>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchDomains = async () => {
      if (loading == false) {
        console.log("fetchDomains");
        const notification = toast.loading("fetching Domains");
        try {
          const res = await fetch(
            `${config.url}/api/domain/getAll`
          );
          if (res.ok) {
            const data = await res.json();
            console.log("data", data);
            setDomains(data);
            toast.success("domains fetched", { id: notification });
          }
        } catch (error) {
          console.log(error);
          toast.error("could not fetch domains", { id: notification });
        }
      }
    };

    fetchDomains();
  }, [loading]);

  // -------------------------------------------------------------------------------------------- //
  // Creating a new Domain using a Modal
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DomainModalFormData>();

  //onsubmission of form modal
  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const notification = toast.loading("Creating new Domain");
    try {
      setLoading(true);
      const res = await fetch(
        `${config.url}/api/domain/create`,
        {
          method: "POST",
          headers: {
            Content_Type: "application/json",
          },
          body: JSON.stringify({
            name: formData.domain,
          }),
        }
      );

      if (res.ok) {
        console.log("Domain created");
        toast.success("Domain Added", { id: notification });
        const text = await res.text();
        console.log(text);
        reset();
        toggleModal();
      }
    } catch (error: any) {
      alert(error.message);
      toast.error(error.message, { id: notification });
    }
    setLoading(false);
  });

  // --------------------------------------------------------------------------------------------- //
  // deleting a Domain using confermation modal
  const [selectedDomain, setSelectedDomain] = useState({});
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const handleDeleteDomain = (domain: any) => {
    toggleDeleteModal();
    setSelectedDomain(domain);
  };
  const toggleDeleteModal = () => {
    setdeleteModalOpen(!deleteModalOpen);
  };
  const handleConfirmDelete = async () => {
    if (selectedDomain) {
      const notification = toast.loading("deleting the Domain");
      setLoading(true);
      try {
        console.log(selectedDomain);
        const res = await fetch(
          `${config.url}/api/domain/delete`,
          {
            method: "POST",
            headers: {
              ContentType: "application/json",
            },
            body: JSON.stringify(selectedDomain),
          }
        );
        if (res.ok) {
          console.log("Domain deleted");
          toast.success("Domain deleted successfully", { id: notification });
          const text = await res.text();
          console.log(text);
          setSelectedDomain("");
          toggleDeleteModal();
        }
      } catch (error) {
        console.log(error);
        toast.error("could not Delete the domain", { id: notification });
      }
      setLoading(false);
    }
  };
  // ------------------------------------------------------------------------------------------------- //
  return (
    <>
      <Header />
      {/* heading and Actions */}
      <div className="border-b">
        <div className="flex flex-wrap max-w-screen-xl mx-auto ">
          <h1 className="text-4xl p-6 font-medium w-2/4">Domains</h1>
          <div className=" flex justify-end gap-4 p-8 flex-grow">
            <button
              disabled
              type="button"
              className=" text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Buy
            </button>
            <button
              type="button"
              onClick={toggleModal}
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Add
            </button>
            <button
              disabled
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Transfer In
            </button>
          </div>
        </div>
      </div>
      {/* Searchbar for domains */}
      <SearchBar setDomains={setDomains}></SearchBar>
      {/* Domains Table */}
      <div className="px-8 mx-auto max-w-screen-xl ">
        <div className="relative overflow-x-auto no-scrollbar shadow-md sm:rounded-lg ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700  bg-gray-50  dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Domain
                </th>
                <th scope="col" className="px-6 py-3">
                  Registrar
                </th>
                <th scope="col" className="px-6 py-3">
                  Nameserver
                </th>
                <th scope="col" className="px-6 py-3">
                  Age
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {domains &&
                domains.map((domain, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      onClick={() => {
                        router.push(`domains/${domain._id}`);
                      }}
                      className="cursor-pointer px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {domain.name}
                    </th>
                    <td className="px-6 py-4">Third Party</td>
                    <td className="px-6 py-4">Third Party</td>
                    <td className="px-6 py-4">
                      <TimeAgo date={domain.createdAt} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          handleDeleteDomain(domain);
                        }}
                        className="cursor-pointer hover:shadow-sm p-2 -m-2  rounded-md hover:bg-white  font-medium text-red-500 dark:text-blue-500 "
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Add domain modal --> */}
      <div
        id="Add-domain_Modal"
        aria-hidden="true"
        className={` ${
          modalOpen ? "" : "hidden"
        } backdrop-blur-sm verflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className=" top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Domain
              </h3>
              <button
                onClick={() => {
                  setModalOpen(false);
                }}
                type="button"
                disabled={loading}
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <CrossIcon className="w-3 h-3" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="">
              <form onSubmit={onSubmit} className=" ">
                <div className="space-y-2 w-full p-5 border-b">
                  <label htmlFor="email_address" className="text-base ">
                    Enter the domain that you would like to add:
                  </label>
                  <input
                    type="email"
                    id="email_address"
                    {...register("domain", { required: true })}
                    className="w-full p-2 px-3 text-sm font-medium rounded-md bg-[#F5F5F5] outline-none focus:ring-1"
                    placeholder="abcd@gmail.com"
                  />
                </div>

                <div className="px-2 py-2 flex items-center justify-between   rounded-t dark:border-gray-600">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                    }}
                    data-modal-hide="progress-modal"
                    type="button"
                    disabled={loading}
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* delete conformation modal */}
      <div
        id="delete-confirm_modal"
        className={`${
          deleteModalOpen ? "" : "hidden"
        } overflow-y-auto backdrop-blur-sm overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              onClick={toggleDeleteModal}
              disabled={loading}
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
            >
              <CrossIcon className="w-3 h-3" />
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <AlertIcon className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this Domain
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                disabled={loading}
                onClick={handleConfirmDelete}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
              >
                Yes, I'm sure
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                disabled={loading}
                onClick={toggleDeleteModal}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default domains;

function CrossIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
      />
    </svg>
  );
}
function AlertIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
