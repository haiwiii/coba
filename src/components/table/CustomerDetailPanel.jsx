import React from 'react';
import { X } from 'lucide-react';

const CustomerDetailPanel = ({ show, onClose, customer }) => {
  if (!show || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full max-w-[520px] h-full overflow-y-auto shadow-2xl animate-slideIn p-0 rounded-l-xl">
        
        {/* Header */}
        <div className="px-6 py-10 lg:py-15 border-b border-gray-100 bg-transparent">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900 mb-8">{customer.customerId}</div>

            <div className="flex items-center gap-3">
              <div className="priority-badge">{customer.category || 'Priority'}</div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-0">{customer.customerName}</div>
        </div>

        {/* Demografi Section */}
        <div className="p-6">
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Demografi</h3>
              <div className="demography-list bg-transparent">
                <DemographyRow label="Age" value={customer.age} color="green" />
                <DemographyRow label="Job" value={customer.job} color="green" />
                <DemographyRow label="Balance" value={customer.balance ?? '-'} color="yellow" />
                <DemographyRow label="Contact Duration" value={customer.duration ? `${customer.duration}s` : '-'} color="yellow" />
                <DemographyRow label="Total Campaign" value={customer.campaign} color="yellow" />
                <DemographyRow label="Total Contact" value={customer.contact} color="yellow" />
                <DemographyRow label="Poutcome" value={customer.poutcome} color="green" />
                <DemographyRow label="Price Index" value={customer.cons_price_idx ?? '-'} color="yellow" />
                <DemographyRow label="Confidence Index" value={customer.cons_conf_idx ?? '-'} color="red" />
              </div>
              <div className="ai-insight mt-4 p-4 rounded-md bg-amber-50 border border-amber-100 text-sm text-gray-700">
                <div className="font-semibold mb-1">AI Insight</div>
                <div className="text-xs text-gray-600">Tidak ada insight tersedia</div>
              </div>
            </div>

            {/* Score circle on the right */}
            <div className="w-28 h-28 shrink-0 flex items-center justify-center">
              <div className="score-circle">
                <div className="score-value">{customer.probability ?? '0%'}</div>
                <div className="text-xs text-gray-500 mt-1">Skor</div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Informasi Komunikasi</h3>
          <div className="space-y-3">
            <DetailRow label="Contact" value={customer.contact} />
            <DetailRow label="Month" value={customer.month} />
            <DetailRow label="Day of Week" value={customer.day_of_week} />
            <DetailRow label="Duration (sec)" value={customer.duration} />
            <DetailRow label="Campaign" value={customer.campaign} />
            <DetailRow label="Pdays" value={customer.pdays} />
            <DetailRow label="Previous" value={customer.previous} />
            <DetailRow label="Poutcome" value={customer.poutcome} />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Indikator Ekonomi</h3>
          <div className="space-y-3">
            <DetailRow label="Emp. Var. Rate" value={customer.emp_var_rate} />
            <DetailRow label="Cons. Price Index" value={customer.cons_price_idx} />
            <DetailRow label="Cons. Conf. Index" value={customer.cons_conf_idx} />
            <DetailRow label="Euribor 3m" value={customer.euribor3m} />
            <DetailRow label="Nr. Employed" value={customer.nr_employed} />
          </div>

          {/* Legend */}
          <div className="mt-6 border-t pt-4">
            <div className="text-sm font-semibold mb-2">Keterangan :</div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /> Red : Negative Value / Dibawah Rata-rata</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400" /> Green : Good / Above Average</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" /> Yellow : Need Attention</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Target Promosi</h3>
          <div className="space-y-3">
            <DetailRow label="Subscribed Deposit" value={customer.y} status />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, status }) => {
  const getStatusColor = (val) => {
    if (val === 'Yes' || val === 'Yes') return 'bg-green-100 text-green-700';
    if (val === 'no' || val === 'No') return 'bg-red-100 text-red-700';
    return '';
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      {status ? (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(value)}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm text-gray-800 font-semibold">{value}</span>
      )}
    </div>
  );
};

const DemographyRow = ({ label, value, color = 'green' }) => {
  const colors = {
    green: 'bg-green-400',
    yellow: 'bg-amber-400',
    red: 'bg-red-500',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${colors[color] || colors.green}`} />
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      </div>

      <div className="text-sm text-gray-600">{value}</div>
    </div>
  );
};

// export default CustomerDetailPanel; (kept below)

export default CustomerDetailPanel;
