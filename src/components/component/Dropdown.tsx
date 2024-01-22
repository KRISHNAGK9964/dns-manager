import { MenuItem } from "@/pages/domains";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  item: MenuItem;
}
const Dropdown: React.FC<Props> = (props) => {
  const { item } = props;
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = item?.children ? item.children : [];

  const toggle = () => {
    setIsOpen((old) => !old);
  };

  const transClass = isOpen ? "flex" : "hidden";

  return (
    <>
      <div className="relative bg-black">
        <button type="button" className="hover:text-blue-400" onClick={toggle}>
          {item.title}
        </button>
        <div
          className={`absolute top-8 z-30 w-[250px] min-h-[300px] flex flex-col py-4 bg-zinc-400 rounded-md ${transClass}`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.route}
              className="hover:bg-zinc-300 hover:text-zinc-500 px-4 py-1"
              href={item?.route || ""}
              onClick={toggle}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/40"
          onClick={toggle}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Dropdown;
