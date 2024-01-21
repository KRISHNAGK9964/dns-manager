import React, { SVGProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TimeAgo from "react-timeago";

// ------------------------------------------------------------------------------------------------- //

type serchBarFormData = {
  query: string;
};

type recordType = {
  _id: string;
  name: string;
  type: string;
  value: string;
  timeLimit: number;
  priority: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// -------------------------------------------------------------------------------------------------- //

const DnsTable = ({
  domain,
  loading,
  setLoading,
  selectedRecord,
  setSelectedRecord,
  editModalOpen,
  setEditModalOpen,
}: any) => {
  // -------------------------------------------------------------------------------------------------------- //
  // fetch Records whenever domain chaged or some operation performed on database and store records as state
  const [records, setRecords] = useState<Array<recordType>>([]);
  useEffect(() => {
    const fetchRecords = async () => {
      if (domain) {
        try {
          console.log("domain", domain);
          const res = await fetch(
            `https://dns-manager-seven.vercel.app/api/DNSRecord/findByDomainId`,
            {
              method: "POST",
              headers: {
                ContentType: "application/json",
              },
              body: JSON.stringify({ domainId: domain._id }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            console.log("data", data);
            setRecords([...data]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchRecords();
  }, [domain, loading]);

  // ------------------------------------------------------------------------------------------------------------- //
  // Edit DNS record using Modal and Save to database
  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };
  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    toggleEditModal();
    console.log(record);
  };

  // ----------------------------------------------------------------------------------------------------------- //
  // search DNS Records by name
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<serchBarFormData>();

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    try {
      const res = await fetch(`api/DNSRecord/query`, {
        method: "POST",
        headers: {
          ContentType: "application/json",
        },
        body: JSON.stringify({ query: formData.query }),
      });
      if (res.ok) {
        console.log("Records fetched");
        const text = await res.json();
        console.log(text);
        setRecords(text);
      }
    } catch (error) {}
  });
  // -------------------------------------------------------------------------------------------------------------------------------- //
  // export DNS Records as JSON File
  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(records)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  // ------------------------------------------------------------------------------------------------------------------------- //
  // Toggle Dropdowns
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const toggleActionsDropdown = () => {
    setActionsDropdownOpen(!actionsDropdownOpen);
  };

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  // -----------------------------------------------------------------------------------------------------------------------------------//
  // Filter Records By Type of Record
  const [selectedTypes, setSelectedTypes] = useState<Array<String>>([]);
  const [types, setTypes] = useState(["A", "AAAA", "CNAME", "MX", "NS"]);
  const handleFilterType = (e: any) => {
    console.log(e.target.checked);
    console.log(e.target.id);
    if (e.target.checked) {
      setSelectedTypes([...selectedTypes, e.target.id]);
    } else {
      const newtypes = selectedTypes.filter((type) => type !== e.target.id);
      setSelectedTypes(newtypes);
    }
  };
  const [filteredRecords, setFilteredRecords] = useState(records);
  useEffect(() => {
    if (selectedTypes.length == 0) {
      setFilteredRecords(records);
    } else {
      console.log(selectedTypes);
      setFilteredRecords(
        records.filter((record) => selectedTypes.includes(record.type))
      );
    }
  }, [selectedTypes, records]);

  // ----------------------------------------------------------------------------------------------------------------------------- //

  return (
    <div className="relative border  bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
      {/* Topbar (Actions and Serch , Filter , Export) */}
      <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full  md:w-1/2">
            <form onSubmit={onSubmit} className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>

                <input
                  type="text"
                  id="simple-search"
                  {...register("query", { required: true })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search"
                  required
                />
              </div>
            </form>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <ExportIcon className="w-4 h-4 mr-2" />
              Export
            </button>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                id="actionsDropdownButton"
                onClick={toggleActionsDropdown}
                data-dropdown-toggle="actionsDropdown"
                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <ArrowDownIcon className="-ml-1 mr-1.5 w-5 h-5" />
                Actions
              </button>
              <div
                id="actionsDropdown"
                className={`${
                  actionsDropdownOpen ? "" : "hidden"
                } absolute mt-32 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="actionsDropdownButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Mass Edit
                    </a>
                  </li>
                </ul>
                <div className="py-1">
                  <a
                    href="#"
                    className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Delete all
                  </a>
                </div>
              </div>
              <button
                id="filterDropdownButton"
                onClick={toggleFilterDropdown}
                data-dropdown-toggle="filterDropdown"
                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <FilterIcon className="h-4 w-4 mr-2 text-gray-400" />
                Filter
                <ArrowDownIcon className="-mr-1 ml-1.5 w-5 h-5"/>
              </button>
              <div
                id="filterDropdown"
                className={`${
                  filterDropdownOpen ? "" : "hidden"
                } absolute mt-60 z-10 w-48  p-3 bg-white rounded-lg shadow dark:bg-gray-700`}
              >
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Choose Type
                </h6>
                <ul
                  className="space-y-2 text-sm"
                  aria-labelledby="filterDropdownButton"
                >
                  {types.map((type, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        id={type}
                        type="checkbox"
                        // checked={}
                        onChange={handleFilterType}
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={type}
                        className=" flex-1 ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                      >
                        {type}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="">
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                Name
              </th>
              <th scope="col" className="px-4 py-3">
                Type
              </th>
              <th scope="col" className="px-4 py-3">
                Value
              </th>
              <th scope="col" className="px-4 py-3">
                TTL
              </th>
              <th scope="col" className="px-4 py-3">
                Priority
              </th>
              <th scope="col" className="px-4 py-3">
                Age
              </th>
              <th scope="col" className="px-4 py-3">
                Comment
              </th>
              <th scope="col" className="px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr
                key={index}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="w-4 px-4 py-3">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                  className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {record.name}
                </th>
                <td className="px-4 py-2">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                    {record.type}
                  </span>
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center">{record.value}</div>
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {record.timeLimit}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {record.priority}
                </td>

                <td className="px-4 py-2  whitespace-nowrap dark:text-white">
                  <div className="flex items-center">
                    <TimeAgo date={record.createdAt}></TimeAgo>
                  </div>
                </td>
                <td className="px-4 py-2">{record.comment}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleEditRecord(record);
                    }}
                    className="cursor-pointer hover:shadow-sm p-2 -m-2  rounded-md hover:bg-white  font-medium text-red-500 dark:text-blue-500 "
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DnsTable;

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function ExportIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}
function ArrowDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      />
    </svg>
  );
}
function FilterIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}
