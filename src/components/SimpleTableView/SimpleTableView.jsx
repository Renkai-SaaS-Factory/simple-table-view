// src/components/SimpleTableView.js

import React, { useState } from "react";

const SimpleTableView = ({
  columns,
  data,
  pageSize = 5,
  onRowClick = () => {},
}) => {
  // State for sorting
  const [sortConfig, setSortConfig] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);

  // Sorting Logic
  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  // Pagination Logic
  const pageCount = Math.ceil(sortedData.length / pageSize);
  const currentRows = sortedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleSort = (columnKey) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === columnKey &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                onClick={() => handleSort(column.accessor)}
                style={{
                  borderBottom: "2px solid #ddd",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                {column.Header}
                {sortConfig && sortConfig.key === column.accessor
                  ? sortConfig.direction === "ascending"
                    ? " 🔼"
                    : " 🔽"
                  : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index} onClick={() => onRowClick(row)}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span style={{ margin: "0 15px" }}>
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SimpleTableView;
