"use client";

import { useEffect, useState, useRef } from "react";
import { TableVirtuoso } from "react-virtuoso";

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
      <div className="block w-7 h-7 self-center rounded-full animate-spin bg-gray-950 border-8 border-dashed border-gray-300"></div>
    </div>
  );
};

export default function Home() {
  const [currentSqrs, setCurrentSqrs] = useState([]);
  const [status, setStatus] = useState({
    pageLoading: "pending",
    tableLoading: "pending",
  });
  const [fetchNewInt, setFetchNewInt] = useState(true);
  const nextPageNum = useRef(1);
  const hasNext = useRef(true);

  useEffect(() => {
    if (fetchNewInt) {
      getCurrentIntegers();
    }
  }, [fetchNewInt]);

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
    //terminate the func, if there is no next page
    if (!hasNext.current) return 0;

    setStatus((prevStatus) => ({ ...prevStatus, tableLoading: "pending" }));
    fetch(`/api/integer?page=${nextPageNum.current}`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        hasNext.current = data.nextPage;
        nextPageNum.current = data.nextPageNum;
        getSqrs(data.integers);
      });
  };

  if (status.pageLoading === "pending") return <PageLoader />;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg overflow-hidden">
        <TableVirtuoso
          className="w-full"
          data={currentSqrs}
          useWindowScroll
          endReached={(e) => setFetchNewInt(e)}
          fixedHeaderContent={() => (
            <tr className="bg-gray-900 px-24">
              <th className="text-left py-3 px-6 font-semibold text-white-200 w-full">
                Integer
              </th>
              <th className="text-left py-3 px-6 font-semibold text-white-200 w-full">
                Square
              </th>
            </tr>
          )}
          itemContent={(index, square) => (
            <>
              <td className="py-2 px-6 border-b border-gray-800">
                {square.int}
              </td>
              <td className="py-2 px-6 border-b border-gray-800">
                {square.sqr}
              </td>
            </>
          )}
        />
      </div>
      {status.tableLoading === "pending" && (
        <div className="mt-4">
          <TableLoader />
        </div>
      )}
    </main>
  );
}
