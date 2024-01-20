import DnsTable from "@/components/component/dnsTable";
import Header from "@/components/component/header";
import React from "react";

const Domain = () => {
  return (
    <>
      <Header />
      <div className="border-b">
        <div className=" flex items-center justify-between p-8 max-w-screen-xl m-auto">
          <div className="flex-1 ">
            <h1 className="text-3xl font-semibold">ihoddps.com</h1>
          </div>
          <div>
            <a
              // onClick={() => {
              //   handleDeleteDomain(domain);
              // }}
              className="cursor-pointer hover:shadow-sm hover:bg-gray-50 p-2  border  rounded-md  font-medium text-red-500 dark:text-blue-500 "
            >
              Delete
            </a>
          </div>
        </div>
        <div className="flex flex-wrap p-8 justify-between max-w-screen-xl mx-auto">
          <div className=" w-1/3 mb-4">
            <p className="pt-2">Registrar</p>
            <p className="pt-2 font-medium">Third Party</p>
          </div>
          <div className=" w-1/3 mb-4">
            <p className="pt-2">Nameservers</p>
            <p className="pt-2 font-medium">Third Party</p>
          </div>
          <div className=" w-1/3 mb-4">
            <p className="pt-2">Expiration Date</p>
            <p className="pt-2 font-medium">-</p>
          </div>
          <div className=" w-1/3 mb-2">
            <p className="pt-2">Creator</p>
            <p className="pt-2 font-medium">krishnagk9964</p>
          </div>
          <div className=" w-1/3 mb-4">
            <p className="pt-2">Age</p>
            <p className="pt-2 font-medium">3d</p>
          </div>
          <div className=" w-1/3 mb-4">
            <p className="pt-2">Edge Network</p>
            <p className="pt-2 font-medium"> Active</p>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto  px-8 p-4">
          <span className=" text-blue-500 hover:underline cursor-pointer">
            ⬅️Back
          </span>
        </div>
      </div>
      <div className="">
        <div className="max-w-screen-xl p-8 py-6 mx-auto">
          <p className="text-3xl font-semibold">DNS Records</p>
        </div>
        <div className="px-8 max-w-screen-xl mx-auto">
          <div className="flex gap-14 justify-between">
            <p className="flex-1">
              DNS records point to services your domain uses, like forwarding
              your domain or setting up an email service. You can enable
              Vercel's nameservers or use a third-party to manage your domain's
              DNS records.
            </p>
            <div className="gap-5 flex justify-between items-center">
              <button
                type="button"
                className="p-1 px-4 border hover:bg-gray-100 rounded-md font-medium"
              >
                Add Email Preset
              </button>
              <button
                type="button"
                className="p-1 px-4 border hover:bg-gray-100 rounded-md font-medium"
              >
                Upload Zone File
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <div className="max-w-screen-xl p-8 mx-auto">
            <form className="border shadow-md rounded-lg overflow-hidden">
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
                        type="text"
                        id="Name"
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
                        className="block w-full p-2 mb-6 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option selected>A</option>
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
                          value={60}
                          aria-describedby="helper-text-explanation"
                          className="block w-16 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="60"
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
                    <span className="text-blue-500">DNS Records🛩️</span>
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
      </div>
      <div className="">
        <div className="p-8 max-w-screen-xl mx-auto">
          <DnsTable />
        </div>
      </div>
    </>
  );
};

export default Domain;
