import React from "react";

const TableBase = ({
  columns,
  data,
  rowKey = "id",
  onRowClick,
  expandedRow,
  renderExpanded,
  fit = false,
}) => {
  // compute recent-added customer ids and names from localStorage and promote them to top
  let recentIds = new Set();
  let recentNames = new Set();
  
  try {
    const raw = localStorage.getItem('lastAddedCustomers');
    const EXPIRY_MS = 1000 * 60 * 15;
    
    if (raw) {
      const arr = JSON.parse(raw) || [];
      const filtered = arr.filter((it) => (Date.now() - (it.ts || 0)) < EXPIRY_MS);
      
      if (filtered.length !== arr.length) {
        // cleanup expired
        localStorage.setItem('lastAddedCustomers', JSON.stringify(filtered));
      }
      
      filtered.forEach((it) => {
        if (it.id) recentIds.add(String(it.id));
        if (it.name) recentNames.add(String((it.name || '').toLowerCase().trim()));
      });
      
      console.log('Recent IDs:', Array.from(recentIds));
      console.log('Recent Names:', Array.from(recentNames));
    } else {
      // fallback to single key (backcompat)
      const single = localStorage.getItem('lastAddedCustomer');
      if (single) {
        try {
          const obj = JSON.parse(single);
          if (obj && (Date.now() - (obj.ts || 0)) < EXPIRY_MS) {
            if (obj.id) recentIds.add(String(obj.id));
            if (obj.name) recentNames.add(String((obj.name || '').toLowerCase().trim()));
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error('Failed reading recent customers', err);
  }

  // Helper function to check if row is recent
  const isRecentRow = (row) => {
    const rid = String(row[rowKey] ?? row.id ?? row.customerId ?? '');
    const name = String(row.customerName || row.name || row.custName || '').toLowerCase().trim();
    
    const matchId = recentIds.has(rid);
    const matchName = name && recentNames.has(name);
    
    if (matchId || matchName) {
      console.log('Found recent row:', { rid, name, matchId, matchName });
    }
    
    return matchId || matchName;
  };

  // promote recent rows to the top, preserving original order within groups
  let sortedData = data;
  if ((recentIds.size > 0 || recentNames.size > 0) && Array.isArray(data) && data.length > 0) {
    const recent = [];
    const others = [];
    
    data.forEach((r) => {
      if (isRecentRow(r)) {
        recent.push(r);
      } else {
        others.push(r);
      }
    });
    
    sortedData = [...recent, ...others];
    console.log('Sorted data - Recent:', recent.length, 'Others:', others.length);
  }

  return (
    <div className="w-full overflow-visible relative">
      <table
        className={`w-full ${
          fit ? "table-fixed" : "table-auto"
        }`}
      >
        {/* HEADER */}
        <thead className="bg-purple-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-sm font-semibold text-gray-700 select-none ${
                  col.headerClassName ?? ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="relative">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => {
              const isRecent = isRecentRow(row);
              // Count how many recent rows appear before this one
              let recentIndex = 0;
              if (isRecent) {
                for (let j = 0; j < i; j++) {
                  if (isRecentRow(sortedData[j])) {
                    recentIndex++;
                  }
                }
              }
              
              return (
                <React.Fragment key={row[rowKey] ?? i}>
                  <tr
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${isRecent ? "relative" : ""}`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key}
                        className={`px-4 py-4 text-sm align-middle ${
                          colIndex === 0 ? "overflow-visible relative" : "max-w-[150px] truncate"
                        } ${fit ? "text-sm" : ""} ${col.cellClassName ?? ""}`}
                        title={row[col.key]}
                      >
                        {colIndex === 0 && isRecent ? (
                          <div className="relative inline-block">
                            {/* Badge positioned to overlap from above - staggered for multiple new customers */}
                            <span 
                              className="absolute inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-500 text-white text-xs font-bold shadow-xl z-[100] border-2 border-white"
                              style={{
                                left: `${-56 - (recentIndex * 20)}px`,
                                top: `${-40 + (recentIndex * 8)}px`,
                                transform: 'translateY(-50%)'
                              }}
                            >
                              New
                            </span>
                            {/* Actual cell content */}
                            <span className="relative z-10">
                              {col.render ? col.render(row) : row[col.key] ?? "-"}
                            </span>
                          </div>
                        ) : (
                          col.render ? col.render(row) : row[col.key] ?? "-"
                        )}
                      </td>
                    ))}
                  </tr>

                  {expandedRow &&
                    row[rowKey] === expandedRow &&
                    renderExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={columns.length} className="px-4 py-4">
                          {renderExpanded(row)}
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableBase;