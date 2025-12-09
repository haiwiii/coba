import React from 'react';
import Navbar from '../components/layout/Navbar';
import CustomerTableContainer from '../components/common/CustomerTableContainer';
import HistoryNotesTable from '../components/notes/HistoryNotesTable';
import ScrollToTop from '../components/ui/ScrollToTop';

const Promotion = () => {
  return (
    <div className="min-h-screen bg-white overflow-visible">
      <Navbar />

      <div className="flex flex-col gap-8 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 py-6 w-full overflow-visible">
          <div className="flex-1 overflow-visible">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Promotion</h1>
              <p className="text-gray-600 text-lg">Manage and track your customer promotion campaigns and interactions effectively.</p>
            </div>
            
            {/* Add overflow-visible to table containers */}
            <div className="overflow-visible mb-8">
              <CustomerTableContainer />
            </div>
            
            <div className="overflow-visible">
              <HistoryNotesTable />
            </div>
          </div>
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
};

export default Promotion;