import Link from "next/link";
import React, { SVGProps, useEffect } from "react";
import { useForm } from "react-hook-form";

// -------------------------------------------------------------------------------------------------------------- //

type dnsRecordFormData = {
  name: string;
  type: string;
  value: string;
  timeLimit: number;
  priority: number;
  comment: string;
};

//----------------------------------------------------------------------------------------------------------------------- //

const EditRecordModal = ({ record, setEditModalOpen, setLoading ,loading}: any) => {
  // --------------------------------------------------------------------------------------------------------------------------------//
  // Edit Record and save to database
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<dnsRecordFormData>();
  const handleAddRecord = handleSubmit(async (formData) => {
    console.log(formData);
    try {
      setLoading(true);
      const res = await fetch(`${process.env.HOSTED_URL}/api/DNSRecord/edit`, {
        method: "POST",
        headers: {
          Content_Type: "application/json",
        },
        body: JSON.stringify({
          recordId: record._id,
          name: formData.name,
          type: formData.type,
          value: formData.value,
          timeLimit: formData.timeLimit,
          priority: formData.priority,
          comment: formData.comment,
        }),
      });

      if (res.ok) {
        console.log("Domain upDated");
        const text = await res.text();
        console.log(text);
        reset();
        setEditModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  });

  // ----------------------------------------------------------------------------------------------------------------------- //
  // delete DNS Record 
  const handleRemoveRecord = async() => {
    try {
        setLoading(true);
        const res = await fetch(`${process.env.HOSTED_URL}/api/DNSRecord/delete`, {
          method: "POST",
          headers: {
            Content_Type: "application/json",
          },
          body: JSON.stringify({
            recordId: record._id,
          }),
        });
  
        if (res.ok) {
          console.log("Domain deleted");
          const text = await res.text();
          console.log(text);
          reset();
          setEditModalOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
  }
  // ---------------------------------------------------------------------------------------------------------------- //
  return (
    <div className="max-w-screen-xl p-8 mx-auto">
      <form
        onSubmit={handleAddRecord}
        className="border shadow-md rounded-lg overflow-hidden bg-white"
      >
        <div className="border-b flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit DNS Record
          </h3>
          <button
            onClick={() => {
              setEditModalOpen(false);
            }}
            disabled={loading}
            type="button"
            className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="authentication-modal"
          >
            <CrossIcon className="w-3 h-3"/>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
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
                  defaultValue={record?.name}
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
                  id="Type"
                  defaultValue={record?.type}
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
                  defaultValue={record.value}
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
                    defaultValue={record.timeLimit}
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
                    defaultValue={record.priority}
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
                defaultValue={record.comment}
                {...register("comment")}
                placeholder="A comment explaining what this DNS record is for"
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <footer className="p-8 py-4 flex justify-between bg-gray-50 items-center">
          <button
            type="button"
            onClick={handleRemoveRecord}
            disabled={loading}
            className="text-gray-900 hover:text-red-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Remove
          </button>

          <button
            type="submit"
            disabled={loading}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
};

export default EditRecordModal;

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
