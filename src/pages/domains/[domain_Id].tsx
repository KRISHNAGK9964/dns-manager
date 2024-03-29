import DnsTable, { recordType } from "@/components/component/dnsTable";
import EditRecordModal from "@/components/component/editRecordModal";
import Header from "@/components/component/header";
import { domainType } from "@/util/functions";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, SVGProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";
import { config } from "../../../Constants";
import Footer from "@/components/component/footer";
import DeletePopup from "@/components/component/DeletePopup";

// --------------------------------------------------------------------------------------------------------------------- //

interface domainProps {}
type dnsRecordFormData = {
  name: string;
  type: string;
  value: string;
  timeLimit: number;
  priority: number;
  comment: string;
};

// --------------------------------------------------------------------------------------------------------------------- //

const Domain: React.FC<domainProps> = () => {
  // --------------------------------------------------------------------------------------------------------------------------//
  // Fetch the domain whenever router object changed(i.e url) and store as a state
  const { data: session, status } = useSession();
  const router = useRouter();
  const [domain, setDomain] = useState<domainType>();
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");
  useEffect(() => {
    const fetchDomain = async () => {
      const domainId = router.query.domain_Id;
      console.log("domainId: ", domainId);
      if (domainId) {
        const notification = toast.loading("fetching the Domain");
        setLoading(true);
        try {
          const res = await fetch(`${config.url}/api/domain/findById`, {
            method: "POST",
            headers: {
              ContentType: "application/json",
            },
            body: JSON.stringify({ _id: domainId }),
          });
          if (res.ok) {
            console.log("Domain fetched");
            const domain = await res.json();
            console.log(domain);
            setDomain(domain);
            toast.success("domain fetched successfully", { id: notification });
            setLoading(false);
          }
        } catch (error: any) {
          seterror(error.message);
          alert(error.message);
          toast.error("error occured while retrieving domain", {
            id: notification,
          });
          console.log(error);
        }
      }
    };
    fetchDomain();
  }, [router]);

  // --------------------------------------------------------------------------------------------------- //
  // create a new DNS Record
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<dnsRecordFormData>();
  const handleAddRecord = handleSubmit(async (formData) => {
    console.log(formData);
    if (domain) {
      const notification = toast.loading("creating DNS record");
      try {
        setLoading(true);
        const res = await fetch(`${config.url}/api/DNSRecord/create`, {
          method: "POST",
          headers: {
            Content_Type: "application/json",
          },
          body: JSON.stringify({
            domainId: domain._id,
            name: formData.name,
            type: formData.type,
            value: formData.value,
            timeLimit: formData.timeLimit,
            priority: formData.priority,
            comment: formData.comment,
          }),
        });

        if (res.ok) {
          console.log("DNS record created");
          toast.success("DNS record Added", { id: notification });
          const text = await res.text();
          console.log(text);
          reset();
        }
      } catch (error: any) {
        alert(error.message);
        toast.error("could not create DNS record", { id: notification });
        console.log(error);
      }
      setLoading(false);
    }
  });

  // ------------------------------------------------------------------------------------------------------------- //
  // Edit DNS record using Modal and Save to database
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<recordType>();

  // ----------------------------------------------------------------------------------------------------------- //
  // delete the domain which consequently delete all associated DNS Records of it
  const [selectedDomain, setSelectedDomain] = useState<domainType>();
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const handleDeleteDomain = (domain: any) => {
    toggleDeleteModal();
    setSelectedDomain(domain);
  };
  const toggleDeleteModal = () => {
    setdeleteModalOpen(!deleteModalOpen);
  };
  const handleConfirmDelete = async () => {
    const notification = toast.loading("Deleting the domain");
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
        toast.success("Domain deletd successfully", { id: notification });
        const text = await res.text();
        console.log(text);
        router.replace("/domains");
      }
    } catch (error) {
      console.log(error);
      toast.error("could not delete the domain", { id: notification });
    }
    setLoading(false);
  };

  // ---------------------------------------------------------------------------------------------------------- //
  // upload DNS records via JSON File
  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (domain && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isJsonFile = file.name.endsWith(".json");

      if (!isJsonFile) {
        alert("Please upload a valid JSON file.");
        return;
      }

      const confirmUpload = window.confirm(
        `upload ${e.target.files[0].name} \n Are you sure JSON file is formatted correctly?`
      );
      if (!confirmUpload) {
        return;
      }
      const notification = toast.loading("uploading records");
      try {
        setLoading(true);
        console.log(file);
        const fileContents = await readFile(file);
        const parsedData = JSON.parse(fileContents);
        console.log(fileContents, parsedData);

        const response = await fetch(
          `${config.url}/api/DNSRecord/bulk-upload`,
          {
            method: "POST",
            headers: {
              ContentType: "application/json",
            },
            body: JSON.stringify({ domainId: domain._id, data: parsedData }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          toast.success("DNS records Added successfully ", {
            id: notification,
          });
        }
      } catch (error: any) {
        console.error("Error uploading DNS records:", error.message);
        toast.error("An error occurred while uploading DNS records.", {
          id: notification,
        });
      }
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------------------------- //
  // delete many DNS Records at once
  const [selectedRecords, setSelectedRecords] = useState<Array<String>>([]);
  const deletehandler = ()=>{
    if(selectedDomain){
      handleConfirmDelete();
    }else{
      handleConfirmDeleteSelected();
    }
  }
  const handleConfirmDeleteSelected = async () => {
    if (selectedRecords.length > 0) {
      const notification = toast.loading("deleting the Records");
      setLoading(true);
      try {
        console.log(selectedRecords);
        const res = await fetch(`${config.url}/api/DNSRecord/deleteMany`, {
          method: "POST",
          headers: {
            ContentType: "application/json",
          },
          body: JSON.stringify(selectedRecords),
        });
        if (res.ok) {
          console.log("Records deleted");
          toast.success("Records deleted successfully", { id: notification });
          const text = await res.text();
          console.log(text);
          setSelectedRecords([]);
          toggleDeleteModal();
        }
      } catch (error) {
        console.log(error);
        toast.error("could not Delete the records", { id: notification });
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Header />
      {/* Domain Specs */}
      {domain && (
        <section className="border-b">
          <div className=" flex items-center justify-between p-8 pb-0 max-w-screen-xl m-auto">
            <div className="flex-1 ">
              <h1 className="text-3xl font-semibold">{domain.name}</h1>
            </div>
            <div>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  handleDeleteDomain(domain);
                }}
                className="cursor-pointer hover:shadow-sm hover:bg-gray-50 p-2  border  rounded-md  font-medium text-red-500 dark:text-blue-500 "
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex flex-wrap p-8 py-0 justify-between max-w-screen-xl mx-auto">
            <div className=" w-1/3 mb-4">
              <p className="pt-2 text-[14px] text-gray-500">Registrar</p>
              <p className="pt-2 font-medium text-[14px] text-gray-900">
                Third Party
              </p>
            </div>
            <div className=" w-1/3 mb-4">
              <p className="pt-2 text-[14px] text-gray-500">Nameservers</p>
              <p className="pt-2 font-medium">Third Party</p>
            </div>
            <div className=" w-1/3 mb-4">
              <p className="pt-2 text-[14px] text-gray-500">Expiration Date</p>
              <p className="pt-2 font-medium">-</p>
            </div>
            <div className=" w-1/3 mb-2">
              <p className="pt-2 text-[14px] text-gray-500">Creator</p>
              <p className="pt-2 font-medium">{session?.user?.name}</p>
            </div>
            <div className=" w-1/3 mb-4">
              <p className="pt-2 text-[14px] text-gray-500">Age</p>
              <div className="pt-2 font-medium">
                <TimeAgo date={domain.createdAt}></TimeAgo>
              </div>
            </div>
            <div className=" w-1/3 mb-4">
              <p className="pt-2 text-[14px] text-gray-500">Edge Network</p>
              <p className="pt-2 font-medium text-[14px] text-gray-900">
                <CircleChecktIcon className="w-6 h-6 inline text-blue-500" /> Active
              </p>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto  px-8 p-4">
            <Link
              href={"/domains"}
              className=" text-blue-500 hover:underline cursor-pointer"
            >
              <ArrowLefttIcon className="w-4 h-4 inline"></ArrowLefttIcon>Back
            </Link>
          </div>
        </section>
      )}
      {/* Add DNS Record Section */}
      <section className="">
        <div className="max-w-screen-xl p-8 py-6 mx-auto">
          <p className="text-2xl font-semibold text-gray-900">DNS Records</p>
        </div>
        <div className="px-8 max-w-screen-xl mx-auto">
          <div className="flex gap-14 justify-between flex-wrap">
            <p className="flex-1 min-w-60 text-sm font-normal text-gray-500">
              DNS records point to services your domain uses, like forwarding
              your domain or setting up an email service. You can enable
              Vercel's nameservers or use a third-party to manage your domain's
              DNS records.
            </p>
            <div className="gap-5 flex justify-between items-center">
              <button
                type="button"
                className="p-1 px-4 border hover:bg-gray-100 rounded-md text-sm font-medium"
              >
                Add Email Preset
              </button>
              <input
                type="file"
                id="uploadJSON"
                className="hidden"
                disabled={loading}
                onChange={handleFileChange}
              />
              <label
                htmlFor="uploadJSON"
                className="p-1 px-4 border hover:bg-gray-100 rounded-md text-sm font-medium"
              >
                Upload Zone File
              </label>
            </div>
          </div>
        </div>

        <div className="">
          <div className="max-w-screen-xl p-8 mx-auto">
            <form
              onSubmit={handleAddRecord}
              className="border shadow-md rounded-lg overflow-hidden"
            >
              <div className="p-8 border-b">
                <div className="flex flex-wrap">
                  <div className="flex flex-1 min-w-72">
                    <div className=" flex-1">
                      <label
                        htmlFor="Name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        id="Name"
                        placeholder="Subdomain"
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className=" ml-4">
                      <label
                        htmlFor="Type"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Type
                      </label>
                      <select
                        defaultValue={"A"}
                        id="Type"
                        {...register("type", { required: true })}
                        className="block w-full p-2 mb-6 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                        <option value="NS">NS</option>
                        <option value="PTR">PTR</option>
                        <option value="SOA">SOA</option>
                        <option value="SRV">SRV</option>
                        <option value="TXT">TXT</option>
                        <option value="DNSSEC">DNSSEC</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-1">
                    <div className="mx-4 flex-1">
                      <label
                        htmlFor="Value"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Value
                      </label>
                      <input
                        type="text"
                        id="Value"
                        placeholder="76.76.21.21"
                        {...register("value", { required: true })}
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <label
                          htmlFor="TTL"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          TTL
                        </label>
                        <input
                          type="number"
                          id="TTL"
                          {...register("timeLimit", { required: true })}
                          aria-describedby="helper-text-explanation"
                          className="block w-16 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="60"
                          defaultValue={60}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="Priority"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Priority
                        </label>
                        <input
                          type="number"
                          id="Priority"
                          defaultValue={0}
                          {...register("priority")}
                          aria-describedby="helper-text-explanation"
                          placeholder=""
                          className="block w-16 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="">
                    <label
                      htmlFor="Comment"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Comment
                    </label>
                    <input
                      type="text"
                      id="Comment"
                      {...register("comment")}
                      placeholder="A comment explaining what this DNS record is for"
                      className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <footer className="p-8 py-4 flex justify-between bg-gray-50 items-center">
                <div className="">
                  <p className="">
                    Learn more about{" "}
                    <Link
                      href={
                        "https://vercel.com/docs/projects/domains/managing-dns-records"
                      }
                      className="text-blue-500"
                    >
                      DNS Records🛩️
                    </Link>
                  </p>
                </div>
                <button
                  type="submit"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Add
                </button>
              </footer>
            </form>
          </div>
        </div>
      </section>
      {/* DNS Records Table */}
      <section className="">
        <div className="p-8 max-w-screen-xl mx-auto">
          <DnsTable
            domain={domain}
            loading={loading}
            setLoading={setLoading}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            toggleDeleteModal={toggleDeleteModal}
            selectedRecords={selectedRecords}
            setSelectedRecords={setSelectedRecords}
          />
        </div>
      </section>
      <Footer />
      {/* <!-- Edit DNS Record modal --> */}
      <div
        id="authentication-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={` ${
          editModalOpen ? "" : "hidden"
        } backdrop-blur-sm verflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className=" top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative p-4 w-full  max-h-full">
          {/* <!-- Modal content --> */}
          <EditRecordModal
            record={selectedRecord}
            setSelectedRecord={setSelectedRecord}
            setSelectedRecords={setSelectedRecords}
            selectedRecords={selectedRecords}
            setEditModalOpen={setEditModalOpen}
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      </div>

      {/* delete conformation modal */}
      <DeletePopup deleteModalOpen={deleteModalOpen} toggleDeleteModal={toggleDeleteModal} loading={loading} handleConfirmDelete={deletehandler} text={selectedDomain ? selectedDomain.name : "records" }/>
    </>
  );
};

export default Domain;

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
function ArrowLefttIcon(
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
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  );
}
function CircleChecktIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
