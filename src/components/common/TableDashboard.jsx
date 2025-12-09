import ProbabilityScore from "../table/ProbabilityScore";
import TableBase from "./TableBase";

const TableDashboard = ({
  data = [],
  onRowClick,
  expandedRow = null,
  renderExpanded = null,
}) => {
  const columns = [
    {
      key: "originalRank",
      label: "Rank",
      render: (r) => <div className="font-semibold">{r.originalRank ?? '-'}</div>
    },
    { key: "id", label: "Cust. ID" },
    { key: "name", label: "Cust. Name" },
    {
      key: "loan",
      label: "Loan",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.loan.toLowerCase() === 'yes'
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {r.loan.charAt(0).toUpperCase() + r.loan.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      key: "deposit",
      label: "Deposite",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.y === 'yes'
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {r.y ? r.y.charAt(0).toUpperCase() + r.y.slice(1).toLowerCase() : 'Unknown'}
        </span>
      ),
    },
    {
      key: "housing",
      label: "Housing",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.housing.toLowerCase() === "yes"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {r.housing.toLowerCase() === "yes" ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "default",
      label: "Default",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.default.toLowerCase() === 'yes' || r.default.toLowerCase()
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {r.default.charAt(0).toUpperCase() + r.default.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.category === "Priority"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {r.category}
        </span>
      ),
    },
    {
      key: "probability",
      label: "Probability Score",
      render: (r) => <ProbabilityScore percentage={r.probability} />,
    },
  ];

  return (
    <TableBase
      columns={columns}
      data={data}
      rowKey={"id"}
      onRowClick={onRowClick}
      expandedRow={expandedRow}
      renderExpanded={renderExpanded}
    />
  );
};

export default TableDashboard;
