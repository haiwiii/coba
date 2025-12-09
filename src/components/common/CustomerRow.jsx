import React from 'react';
import { Plus, Eye } from 'lucide-react';
import Button from '../ui/button';

const Badge = ({ value }) => {
  const colors = {
    Yes: 'bg-green-100 text-green-700',
    No: 'bg-gray-200 text-gray-600',
    Priority: 'bg-purple-100 text-purple-700'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[value] || 'bg-gray-100'}`}>
      {value}
    </span>
  );
};

const CustomerRow = ({ customer, onAddNote, onView }) => (
  <tr className="border-b hover:bg-purple-50">
    <td className="px-4 py-4">{customer.originalRank}</td>
    <td className="px-4 py-4">{customer.customerId}</td>
    <td className="px-4 py-4">{customer.customerName}</td>
    <td className="px-4 py-4"><Badge value={customer.hasLoan} /></td>
    <td className="px-4 py-4"><Badge value={customer.housing === 'yes' ? 'Yes' : 'No'} /></td>
    <td className="px-4 py-4"><Badge value={customer.hasDeposit} /></td>
    <td className="px-4 py-4"><Badge value={customer.hasDefault} /></td>
    <td className="px-4 py-4">
      <Badge value={Number(customer.probability) > 50 ? 'Priority' : 'Non-Priority'} />
    </td>
    <td className="px-4 py-4">{customer.probability}</td>
    <td className="px-4 py-4">
      <div className="flex space-x-2">
        <Button 
          onClick={() => onAddNote(customer)}
          variant="danger"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          title="Add Note"
        />
        <Button 
          onClick={() => onView(customer)}
          variant="ghost"
          size="sm"
          icon={<Eye className="w-4 h-4" />}
          title="View"
        />
      </div>
    </td>
  </tr>
);

export default CustomerRow;