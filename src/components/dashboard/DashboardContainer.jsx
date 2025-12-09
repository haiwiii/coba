import { useMemo, useState } from 'react';

// Components
import ExpandedRowContent from '../../components/common/ExpandedRowContent';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import TableDashboard from '../../components/common/TableDashboard';
import LoadingScreen from '../../components/ui/LoadingScreen';
import NoteModal from '../../components/notes/NoteModal';
import ScrollToTop from '../../components/ui/ScrollToTop';
import FilterPanel from '../../components/filter/FilterPanel';

// Top Charts
import { CampaignChart } from './CampaignChart';
import { SegmentationChart } from './SegmentationChart';
import { TrendChart } from './TrendChart';

// Sales Campaign Charts (New)
import { CampaignChartSales } from './CampaignChartSales';
import { CampaignPerformanceDonut } from './CampaignPerformanceDonut';

// Middle Charts (Below Table)
import { CreditStatusChart } from './CreditStatusChart';
import { JobDepositChart } from './JobDepositChart';
import { JobSaldoChart } from './JobSaldoChart';

// Bottom Charts (Campaign Efectivity)
import { ContactDistributionChart } from './ContactDistributionChart';
import { ContactDurationChart } from './ContactDurationChart';
import { ContactEfectivityChart } from './ContactEfectivityChart';
import { ContactTypeChart } from './ContactTypeChart';

// Hooks
import { useCustomers } from '../../hooks/useCustomers';
import { useDashboard } from '../../hooks/useDashboard';
import { useNoteManager } from '../../hooks/useNoteManager';

import { logActivity } from '../utils/activityLogger';

const DashboardContainer = () => {
  // Data
  const { 
    customers,
    page,
    pageSize,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
    setFilters,
    setSearch
  } = useCustomers();

  const { distData, refreshDashboard, lastFetched } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const [filterState, setFilterState] = useState({
    rank: null,
    probabilityRanges: [],
    categories: [],
    ageRanges: [],
    balanceSort: null,
    hasDeposit: null,
    hasLoan: null
  });

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const {
    showNoteModal,
    noteTitle,
    setNoteTitle,
    noteContent,
    setNoteContent,
    editingNote,
    handleSaveNote,
    closeNoteModal,
  } = useNoteManager();

  const handleApplyFilters = (newFilters) => {
    const defaultShape = {
      rank: null,
      probabilityRanges: [],
      categories: [],
      ageRanges: [],
      balanceSort: null,
      hasDeposit: null,
      hasLoan: null
    };

    setFilterState(newFilters);
    setFilters(newFilters);
    setPage(1);

    const isReset =
      JSON.stringify(newFilters) === JSON.stringify(defaultShape);

    logActivity(isReset ? 'filter_reset' : 'filter_applied', {
      filters: newFilters
    });

    setShowFilterPanel(false);
  };

  // =====================================================================
  // DATA MAPPING
  // =====================================================================
  const segmentationData = useMemo(() => {
    if (!distData?.customerDistribution) return [];

    // Map backend rows into fixed order
    let priority = 0, nonPriority = 0, others = 0;

    distData.customerDistribution.forEach(item => {
      switch (item.category) {
        case 'Priority':
          priority = item.value;
          break;
        case 'Not Priority':
          nonPriority = item.value;
          break;
        case 'Others':
          others = item.value;
          break;
      }
    });

    return [
      { name: 'Priority', value: Number(priority) },
      { name: 'Not Priority', value: Number(nonPriority) },
      { name: 'Others', value: Number(others) },
    ].filter(d => d.value > 0);
  }, [distData]);

  const campaignData = useMemo(() => {
    if (!distData?.campaignDistribution) return [];
    const entries = Object.entries(distData.campaignDistribution);
    let c1 = 0, c2 = 0, c3 = 0, cMore = 0;
    entries.forEach(([campaignCount, total]) => {
      const count = Number(campaignCount);
      if (count === 1) c1 += total;
      else if (count === 2) c2 += total;
      else if (count === 3) c3 += total;
      else cMore += total;
    });
    return [
      { name: '1x Contact', value: c1 },
      { name: '2x Contacts', value: c2 },
      { name: '3x Contacts', value: c3 },
      { name: '>3x Contacts', value: cMore },
    ].filter((d) => d.value > 0);
  }, [distData]);

  const trendData = useMemo(() => {
    if (!distData?.promotionTrends?.daily || !distData?.promotionTrends?.monthly) return { daily: [], monthly: [] };

    const daily = distData.promotionTrends.daily.map(d => ({
      dayName: d.day.charAt(0).toUpperCase() + d.day.slice(1), // X-axis for daily
      daily: d.total_contacted, // value for daily line
    }));

    const monthly = distData.promotionTrends.monthly.map(m => ({
      monthName: m.month.charAt(0).toUpperCase() + m.month.slice(1), // X-axis for monthly
      monthly: m.total_contacted, // value for monthly line
    }));

    return { daily, monthly };
  }, [distData]);

  const jobDepositData = useMemo(() => {
    if (!distData?.jobDepositDistribution) return [];
    return distData.jobDepositDistribution.slice(0, 7).map((item) => ({
      name: item.job,
      deposit: item.total_deposit_subscribers,
    }));
  }, [distData]);

  const jobSaldoData = useMemo(() => {
    if (!distData?.topAverageBalanceByJob) return [];
    return distData.topAverageBalanceByJob.slice(0, 6).map((item) => ({
      job: item.job,
      saldo: item.avg_deposit_balance,
    }));
  }, [distData]);

  const toggleRow = (customerId) => setExpandedRow((prev) => (prev === customerId ? null : customerId));

  // Use all customers without date filtering
  const filteredCustomers = customers;

  const CAMPAIGN_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#64748b'];
  const [selectedSegmentationName, setSelectedSegmentationName] = useState(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState(null);

  if (!customers || !distData) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="flex-1 flex flex-col gap-12 pr-2 min-w-0">
        {/* --- TOP CHARTS --- */}
        <div className="flex flex-col md:flex-row gap-3 w-full h-auto md:h-[280px]">
          <div className="w-full md:w-1/2 bg-gradient-to-br from-[#bd76f6] to-[#7c3aed] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden flex flex-col justify-between">
            <h3 className="text-sm font-medium text-white z-10">Cust. Segmentation Distribution</h3>
            <div className="flex-1 flex flex-row items-center justify-center gap-8 relative z-10 pl-2">
              <div className="scale-110 shrink-0">
                <SegmentationChart data={segmentationData} selectedName={selectedSegmentationName} />
              </div>
              <div className="flex flex-col gap-4">
                {segmentationData.slice(0, 3).map((item, idx) => (
                  <div key={item.name} className={`flex items-center gap-3 cursor-pointer select-none ${selectedSegmentationName && selectedSegmentationName !== item.name ? 'opacity-40' : ''}`} onClick={() => setSelectedSegmentationName((s) => (s === item.name ? null : item.name))}>
                    <span className={`w-2 h-2 rounded-full shadow-sm ring-2 ring-white/20 ${idx === 0 ? 'bg-[#fbbf24]' : 'bg-[#2dd4bf]'}`} />
                    <div>
                      <div className="text-xs opacity-80">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-[-50%] right-[-10%] w-80 h-80 bg-white opacity-10 rounded-full blur-[80px] pointer-events-none"></div>
          </div>

          <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-gray-100 overflow-hidden">
            <h3 className="text-sm font-medium text-gray-700">Campaign Rate Distribution</h3>
            <div className="flex-1 flex flex-row items-center justify-center gap-8">
              <div className="scale-110 shrink-0"><CampaignChart data={campaignData} selectedName={selectedCampaignName} /></div>
              <div className="flex flex-col gap-4">{
                (() => {
                  const total = campaignData.reduce((s, d) => s + d.value, 0);
                  return campaignData.map((item, idx) => {
                    const pct = total ? Math.round((item.value / total) * 100) : 0;
                    const isActive = !selectedCampaignName || selectedCampaignName === item.name;
                    return (
                      <div key={idx} className={`flex items-center gap-3 cursor-pointer select-none ${!isActive ? 'opacity-40' : ''}`} onClick={() => setSelectedCampaignName((s) => (s === item.name ? null : item.name))}>
                        <span className="w-2 h-2 rounded-full shadow-sm shrink-0" style={{ backgroundColor: CAMPAIGN_COLORS[idx % CAMPAIGN_COLORS.length] }}></span>
                        <div>
                          <div className="text-xl font-bold leading-none text-gray-800">{pct}%</div>
                          <div className="text-xs text-gray-500">{item.name}</div>
                        </div>
                      </div>
                    );
                  });
                })()
              }</div>
            </div>
          </div>
        </div>

        {/* --- TREND CHART --- */}
        <div className="bg-[#1a1b2e] rounded-2xl p-6 shadow-lg text-white">
          <h3 className="text-lg font-medium mb-4">Promotion Trends</h3>
          <TrendChart data={trendData} />
        </div>

        {/* --- SALES CAMPAIGN CHART & PERFORMANCE --- */}
        {distData?.salesNotesDistribution && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Campaign Distribution Chart */}
            <div className="lg:col-span-2 bg-[#1a1b2e] rounded-2xl p-6 shadow-lg text-white">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-2">Your Campaign Distribution</h3>
                  <p className="text-xs text-gray-400">Notes created by you (toggle between weekly and monthly view)</p>
                </div>
                <div className="flex flex-col items-end">
                  <button onClick={refreshDashboard} className="px-3 py-2 bg-gray-700 text-white rounded mb-1 text-sm">Refresh</button>
                  {lastFetched && (
                    <div className="text-xs text-gray-400">Updated {new Date(lastFetched).toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
              <CampaignChartSales data={distData.salesNotesDistribution} />
            </div>

            {/* Campaign Performance Donut */}
            <div className="bg-[#1a1b2e] rounded-2xl p-6 shadow-lg text-white">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Your Campaign Performance</h3>
              </div>
              <CampaignPerformanceDonut data={distData.salesNotesDistribution} />
            </div>
          </div>
        )}

        {/* --- TABLE --- */}
          <div className="space-y-6 pt-8 overflow-hidden">
          <h3 className="text-[25px] font-bold text-gray-800 mb-4">
            <span className="block bg-gray-200 text-gray-500 rounded-l-full pl-6 py-3 leading-none shadow-sm w-full">Customer Rank</span>
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible pt-4">
            <div className="flex justify-between items-center px-4 mb-2 gap-4">
              <div className="w-full">
                <SearchBar value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setSearch(e.target.value); setPage(1); }} placeholder="Search by customer name or ID..." />
              </div>
              <button onClick={() => setShowFilterPanel(true)} className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition shadow-md font-medium">Filter</button>
            </div>

            <TableDashboard data={filteredCustomers} onRowClick={(customer) => toggleRow(customer.id)} expandedRow={expandedRow} renderExpanded={(row) => (
              <ExpandedRowContent customer={row} onAddNote={() => {}} onEditNote={() => {}} onDeleteNote={() => {}} hideNotes />
            )} />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              itemsPerPage={pageSize}
              itemsPerPageOptions={[10,20,30,40,50,60,70,80,90,100]}
              totalItems={totalItems}
              startIndex={(page - 1) * pageSize}
              endIndex={page * pageSize}
              onPageChange={setPage}
              onItemsPerPageChange={(e) => {
                setPageSize(Number(e.target.value)); setPage(1);
              }}
            />
          </div>
        </div>

        {/* --- MIDDLE CHARTS --- */}
        <div className="flex flex-col lg:flex-row gap-6 pb-6 w-full">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Total Deposite by Credit Status</h3>
              <CreditStatusChart/>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Total Deposite by Job</h3>
              <JobDepositChart data={jobDepositData} />
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 h-full flex flex-col">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Top Average Saldo by job</h3>
              <div className="flex-1 flex flex-col justify-center"><JobSaldoChart data={jobSaldoData} /></div>
            </div>
          </div>
        </div>

        {/* --- CAMPAIGN EFECTIVITY --- */}
        <div className="pt-2 pb-7">
          <h3 className="text-[25px] font-bold text-gray-800 mb-6 relative">
            <span className="block bg-gray-200 text-gray-500 rounded-l-full pl-6 py-3 leading-none shadow-sm w-full">Campaign Efectivity</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200"><h4 className="text-sm font-medium text-gray-600 mb-4">Contact Duration</h4><ContactDurationChart /></div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200"><h4 className="text-sm font-medium text-gray-600 mb-4">Contact Efectivity</h4><ContactEfectivityChart /></div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200"><h4 className="text-sm font-medium text-gray-600 mb-4">Contact Distribution each Month</h4><ContactDistributionChart /></div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200"><h4 className="text-sm font-medium text-gray-600 mb-4">Type of Contact</h4><ContactTypeChart /></div>
          </div>
        </div>

      </div>

      <NoteModal show={showNoteModal} onClose={closeNoteModal} onSave={handleSaveNote} noteTitle={noteTitle} setNoteTitle={setNoteTitle} noteContent={noteContent} setNoteContent={setNoteContent} editingNote={editingNote} />

      <FilterPanel
        show={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filterState}
        onApply={handleApplyFilters}
      />

      <ScrollToTop />
    </>
  );
};

export default DashboardContainer;
