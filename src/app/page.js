"use client";

import { useEffect, useState} from "react";
import { TableVirtuoso } from "react-virtuoso";


const TOTAL_INTEGERS = 100_000
const BATCH_SIZE = 1000; // How many rows to fetch per API call

export default function Home() {
  const [sqrs, setSqrs] = useState([]); 
  const [status, setStatus] = useState({
    pageLoading: "pending",
    tableLoading: "pending",
  });

  useEffect(()=>{
    /**
     * LoadMore function only run's if user scrolled the end  of the table,
     * but there is no table in initial load, so no data to scroll,
     * in order to tackel that we wil run swr func with startIndex = 0 
     */
    getSqrs(0)
  },[])


  const getSqrs = (startIndex) => {
    setStatus((prevStatus) => ({ ...prevStatus, tableLoading: "pending" }));

    const ints = Array.from({length: BATCH_SIZE}, (_, intIndex)=> intIndex + startIndex)
    fetch(`/api/square`, {
      method: "POST",
      body: JSON.stringify({
        integers: ints,
      }),
    }).then(async (data) => {
      const intt = await data.json();

      setSqrs((currentSqrs) => [...currentSqrs, ...intt.sqrs]);
      setStatus((prevStatus) => ({ ...prevStatus, tableLoading: "completed" }));
      //only for initial page load
      if (status.pageLoading === "pending")
        setStatus((prevStatus) => ({
          ...prevStatus,
          pageLoading: "completed",
        }));

    });

  };

  const loadMore = (startIndex) => {
    if(sqrs.length>=TOTAL_INTEGERS) console.log("ENDED")
    getSqrs(startIndex);
  }


  if (status.pageLoading === "pending") return <PageLoader />;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg overflow-hidden">
        <TableVirtuoso
          className="w-full"
          data={sqrs}
          useWindowScroll
          endReached={(e) => {
            loadMore(e)
          }}
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
