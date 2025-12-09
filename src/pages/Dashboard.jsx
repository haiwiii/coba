import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Statusbar from '../components/layout/Statusbar';
import DashboardContainer from '../components/dashboard/DashboardContainer';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import ScrollToTop from '../components/ui/ScrollToTop';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <div className="w-full overflow-visible">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-lg">All your customer data and promotion performance, tracked, measured, and optimized in one powerful dashboard.</p>
          </div>

          {/* Main Layout: Sidebar at top + Calendar at top right */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Sidebar Stats (3 columns) */}
            <div className="lg:col-span-3">
              <Statusbar />
            </div>

            {/* Calendar Widget (1 column) */}
            <div className="lg:col-span-1">
              <CalendarWidget 
                onDateSelect={setSelectedDate} 
                selectedDate={selectedDate}
              />
            </div>
          </div>

          {/* Dashboard Container Below - with overflow visible */}
          <div className="overflow-visible">
            <DashboardContainer />
          </div>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default Dashboard;