import React from 'react';
import TableBase from './TableBase';
import ProbabilityScore from '../table/ProbabilityScore';
import { Plus, Eye } from 'lucide-react';

const TablePromotion = ({
  data = [],
  onRowClick,
  onAddNote,
  onView,
  expandedRow = null,
  renderExpanded = null,
}) => {

  const columns = [
    { 
      key: 'originalRank',
      label: 'Rank',
      headerClassName: 'text-left w-16',
      cellClassName: 'text-left w-16',
      render: (r) => <div className="font-semibold">{r.originalRank ?? '-'}</div>
    },
    { 
      key: 'id',
      label: 'Cust.ID',
      headerClassName: 'w-32 text-left',
      cellClassName: 'w-32 text-left'
    },
    { 
      key: 'name',
      label: 'Cust.Name',
      headerClassName: 'text-left w-36',
      cellClassName: 'text-left w-36'
    },
    { 
      key: 'loan',
      label: 'Loan',
      headerClassName: 'w-24 text-left',
      cellClassName: 'w-24 text-left',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          r.loan.toLowerCase() === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
        }`}>
          {r.loan.charAt(0).toUpperCase() + r.loan.slice(1).toLowerCase()}
        </span>
      )
    },
    { 
      key: 'deposit',
      label: 'Deposite',
      headerClassName: 'w-24 text-left',
      cellClassName: 'w-24 text-left',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          r.y === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
        }`}>
          {r.y ? r.y.charAt(0).toUpperCase() + r.y.slice(1).toLowerCase() : 'Unknown'}
        </span>
      )
    },
    { 
      key: 'housing',
      label: 'Housing',
      headerClassName: 'w-24 text-left',
      cellClassName: 'w-24 text-left',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          r.housing.toLowerCase() === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
        }`}>
          {r.housing === 'yes' ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      key: 'default',
      label: 'Default',
      headerClassName: 'w-24 text-left',
      cellClassName: 'w-24 text-left',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          r.default.toLowerCase() === 'yes' || r.default.toLowerCase() === 'unknown' 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {r.default.charAt(0).toUpperCase() + r.default.slice(1).toLowerCase()}
        </span>
      )
    },
    { 
      key: 'category',
      label: 'Category',
      headerClassName: 'w-32 text-left',
      cellClassName: 'w-32 text-left',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          r.category === 'Priority' 
            ? 'bg-purple-200 text-purple-800 border border-purple-200' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {r.category}
        </span>
      )
    },
    { 
      key: 'probability',
      label: 'Probability Score',
      headerClassName: 'w-40 text-left whitespace-nowrap',
      cellClassName: 'w-40 text-left whitespace-nowrap overflow-visible max-w-none',
      render: (r) => <ProbabilityScore percentage={r.probability} />
    },
    { 
      key: 'action',
      label: 'Action',
      headerClassName: 'w-32 text-left',
      cellClassName: 'w-32 text-left',
      render: (r) => (
        <div className="flex space-x-2">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onAddNote && onAddNote(r); 
            }} 
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" 
            title="Add Note"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onView && onView(r); 
            }} 
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" 
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <TableBase
      columns={columns}
      data={data}
      rowKey="id"
      onRowClick={onRowClick}
      expandedRow={expandedRow}
      renderExpanded={renderExpanded}
      fit={true}
    />
  );
};

export default TablePromotion;