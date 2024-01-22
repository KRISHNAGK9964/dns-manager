import Header from "@/components/component/header";
import SearchBar from "@/components/component/searchBar";
import { useRouter } from "next/router";
import React, { RefObject, SVGProps, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";
import { config } from "../../Constants";
import Dropdown from "@/components/component/Dropdown";
import Link from "next/link";
import useClickOutside from "@/hooks/useClickOutside";
import DeletePopup from "@/components/component/DeletePopup";
import Footer from "@/components/component/footer";
import { getSession } from "next-auth/react";

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

export interface MenuItem {
  title: string;
  route?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "",
    children: [{ title: "Delete" }],
  },
];
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
          const res = await fetch(`${config.url}/api/domain/getAll`);
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
      const res = await fetch(`${config.url}/api/domain/create`, {
        method: "POST",
        headers: {
          Content_Type: "application/json",
        },
        body: JSON.stringify({
          name: formData.domain,
        }),
      });

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
        const res = await fetch(`${config.url}/api/domain/delete`, {
          method: "POST",
          headers: {
            ContentType: "application/json",
          },
          body: JSON.stringify(selectedDomain),
        });
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
  // delete Multiple domains
  const [selectedDomains, setSelectedDomains] = useState<Array<string>>([]);
  const DomainSelecthandler = (e: any, domain: domainType) => {
    if (e.target.checked) {
      setSelectedDomains([...selectedDomains, domain._id]);
    } else {
      setSelectedDomains(selectedDomains.filter((_id) => _id !== domain._id));
    }
  };
  const selectAllDomainhandler = (e: any) => {
    if (e.target.checked) {
      if (domains) setSelectedDomains(domains.map((d) => d._id));
    } else {
      setSelectedDomains([]);
    }
  };

  const actionsDropdownRef = useClickOutside(() => {
    setActionsDropdownOpen(false);
  });
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);

  const deleteActionhandler = () => {
    toggleDeleteModal();
  };
  const handleConfirmDeleteSelected = async () => {
    if (selectedDomains.length > 0) {
      const notification = toast.loading("deleting the Domains");
      setLoading(true);
      try {
        console.log(selectedDomains);
        const res = await fetch(`${config.url}/api/domain/deleteMany`, {
          method: "POST",
          headers: {
            ContentType: "application/json",
          },
          body: JSON.stringify(selectedDomains),
        });
        if (res.ok) {
          console.log("Domains deleted");
          toast.success("Domains deleted successfully", { id: notification });
          const text = await res.text();
          console.log(text);
          setSelectedDomains([]);
          toggleDeleteModal();
        }
      } catch (error) {
        console.log(error);
        toast.error("could not Delete the domains", { id: notification });
      }
      setLoading(false);
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------------------- //
  return (
    <div className="min-h-screen flex-col flex">
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
      <div className="">
        <SearchBar setDomains={setDomains}></SearchBar>
      </div>
      {/* Domains Table */}
      <div className="">
        <div className="flex-1 px-8 mx-auto max-w-screen-xl pb-10">
        <div className="relative overflow-x-auto no-scrollbar shadow-md sm:rounded-lg ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700  bg-gray-100  dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      checked={
                        selectedDomains.length == domains?.length &&
                        domains.length != 0
                          ? true
                          : false
                      }
                      onChange={selectAllDomainhandler}
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
                <th
                  ref={actionsDropdownRef}
                  scope="col"
                  className="px-6 py-3 relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActionsDropdownOpen((old) => !old);
                    }}
                    className="cursor-pointer hover:shadow-sm p-2 -m-2  rounded-md hover:bg-white  font-medium dark:text-blue-500 "
                  >
                    <EllipsisIcon className="w-6 h-6" />
                  </button>
                  <div
                    className={`${
                      actionsDropdownOpen ? "flex-col" : "hidden"
                    } absolute w-32 top-12 right-12 z-10  rounded-lg p-2  bg-white border shadow-md`}
                  >
                    <button
                      type="button"
                      disabled
                      className="w-full p-2 text-left font-normal text-base hover:bg-gray-100 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={deleteActionhandler}
                      className="w-full p-2 text-left font-normal text-base hover:bg-gray-100 rounded-md text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {domains &&
                domains.map((domain, index) => (
                  <tr
                    key={index}
                    className={`${
                      selectedDomains.includes(domain._id)
                        ? "bg-gray-50"
                        : "bg-white"
                    }  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          checked={selectedDomains.includes(domain._id)}
                          onChange={(e) => DomainSelecthandler(e, domain)}
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
                        type="button"
                        onClick={() => {
                          handleDeleteDomain(domain);
                        }}
                        className="cursor-pointer hover:shadow-sm p-2 -m-2  rounded-md hover:bg-white  font-medium dark:text-blue-500 "
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      
      <Footer />
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
                  <label htmlFor="domain_name" className="text-base ">
                    Enter the domain that you would like to add:
                  </label>
                  <input
                    id="domain_name"
                    {...register("domain", {
                      required: "Domain name is",
                      pattern: {
                        value:
                          /^(?!:\/\/)(?!www\.)([a-zA-Z0-9-]{1,61}\.[a-zA-Z]{2,6})$/,
                        message: "Invalid domain name",
                      },
                    })}
                    className="w-full p-2 px-3 text-sm font-medium rounded-md bg-[#F5F5F5] outline-none focus:ring-1"
                    placeholder="abcd@gmail.com"
                  />
                  {errors.domain && (
                    <p className="text-red-500">{errors.domain.message}</p>
                  )}
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
      <DeletePopup
        deleteModalOpen={deleteModalOpen}
        toggleDeleteModal={toggleDeleteModal}
        loading={loading}
        handleConfirmDelete={handleConfirmDelete}
      />
      <DeletePopup
        deleteModalOpen={deleteModalOpen}
        toggleDeleteModal={toggleDeleteModal}
        loading={loading}
        handleConfirmDelete={handleConfirmDeleteSelected}
      />
    </div>
  );
};

export default domains;

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
function EllipsisIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      />
    </svg>
  );
}
function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}
