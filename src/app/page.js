"use client";

import { useEffect, useState, useRef } from "react";

const PageLoader = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="block w-10 h-10 rounded-full animate-spin bg-black border-8 border-dashed border-gray-850"></div>
    </div>
  );
};

const TableLoader = () => {
  return (
    <div className="flex w-full  justify-center items-center py-3">
      <div className="block w-7 h-7 self-center rounded-full animate-spin bg-gray-950 border-8 border-dashed border-white"></div>
    </div>
  );
};

export default function Home() {
  const [currentSqrs, setCurrentSqrs] = useState([]);

  //use this for refactoring
  const [status, setStatus] = useState({
    pageLoading: "pending",
    tableLoading: "pending",
  });
  const nextPageNum = useRef(1);
  const previousPage = useRef(0); //remove this

  const [hasNext, setHasNext] = useState(true);

  console.log(status);

  useEffect(() => {
    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    getCurrentIntegers();
  }, []);

  const handleScroll = () => {
    const scrollTop = window.scrollY; // Scroll position from the top
    const windowHeight = window.innerHeight; // Height of the viewport
    const docHeight = document.documentElement.scrollHeight; // Total height of the document

    // Calculate the scroll position percentage
    const scrollPercent = (scrollTop + windowHeight) / docHeight;

    // Check if the user has scrolled more than 80% of the page, if did fetch next batch of table data
    if (scrollPercent >= 0.9) {
      console.log("User has scrolled 80% of the page");
      if (hasNext) getCurrentIntegers();
    }
  };

  const getSqrs = (ints) => {
    fetch(`/api/square`, {
      method: "POST",
      body: JSON.stringify({
        integers: ints,
      }),
    }).then(async (data) => {
      const dd = await data.json();
      setCurrentSqrs((currentSqrs) => [...currentSqrs, ...dd.sqrs]);

      //for initial page load
      if (status.pageLoading === "pending")
        setStatus((prevStatus) => ({
          ...prevStatus,
          pageLoading: "completed",
        }));

      //for table data load
      setStatus((prevStatus) => ({ ...prevStatus, tableLoading: "completed" }));
    });
  };

  const getCurrentIntegers = () => {
    previousPage.current = nextPageNum.current - 1;
    console.log("running the current int func");
    setStatus((prevStatus) => ({ ...prevStatus, tableLoading: "pending" }));
    fetch(`/api/integer?page=${nextPageNum.current}`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setHasNext(data.nextPage);
        nextPageNum.current = data.nextPageNum;
        getSqrs(data.integers);
      });
  };

  if (status.pageLoading === "pending") return <PageLoader />;

  return (
    <div className="flex items-center justify-center ">
      <div className="overflow-x-auto w-full max-w-3xl px-3 sm:px-2 md:px-0 pb-8">
        <table className="min-w-full divide-y-2 divide-gray-800 bg-gray-950 text-sm shadow-xl border-gray-900">
          <thead className="">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-lg text-white">
                Integer
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-lg text-white">
                Square
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {currentSqrs?.map((sqr, i) => (
              <tr className="" key={i + 1}>
                <td className="whitespace-nowrap px-4 py-2 font-medium bg-gray-950  text-white text-center">
                  {sqr.int}
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium bg-gray-950  text-white text-center">
                  {sqr.sqr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {status.tableLoading === "pending" && (
          <TableLoader/>
        )}
        {!hasNext&&<h1 className="text-7xl">you have reached the end</h1>}
      </div>
    </div>
  );
}
