import React from 'react';
import Navbar from '../components/layout/Navbar';
import CustomerEntryContainer from '../components/customer/CustomerEntryContainer';
import ScrollToTop from '../components/ui/ScrollToTop';

const CustomerEntry = () => (
  <div className="min-h-screen bg-white">
    <Navbar />

    <div className="flex flex-col gap-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 w-full">
        <div className="flex-1 min-w-0">
          <CustomerEntryContainer />
        </div>
      </div>
    </div>

    <ScrollToTop />
  </div>
);

export default CustomerEntry;
