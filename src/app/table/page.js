'use client'

import { Virtuoso, TableVirtuoso } from "react-virtuoso"


export default function Table(){
    return (
        <TableVirtuoso
        className="flex"
          data={Array.from({ length: 100000 }, (_, index) => {
            return ({ integer: `${index}`, square: `${index**2}` })
          })}
          useWindowScroll
          fixedHeaderContent={(index, user) => (
            <tr className="bg-blue-500">
              <th className="text-left">Integer</th>
              <th className="text-left">Square</th>
            </tr>
          )}
          itemContent={(index, user) => (
            <>
              <td className="pr-4">{user.integer}</td>
              <td>{user.square}</td>
            </>
          )}
        />
      )
}