import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getStatusColor, getCustomerInsight } from '../../api/api';

const statusColor = async (token, value, type, key) => {
  // status dot color
  if (type === 'boolean') return value === 'Yes' || value === 'yes' || value === true ? 'bg-green-500' : 'bg-red-500';
  if (type === 'probability') {
    const v = parseInt(String(value).replace('%', '')) || 0;
    if (v >= 70) return 'bg-green-500';
    if (v >= 50) return 'bg-yellow-400';
    return 'bg-red-500';
  }
  if (type === 'age') {
    const a = Number(value) || 0;
    if (a >= 30 && a <= 60) return 'bg-green-500';
    if (a > 60) return 'bg-yellow-400';
    return 'bg-green-500';
  }
  if (type === 'numeric' && key) {
    const n = Number(String(value).replace(/[^0-9.-]+/g, '')) || 0;
    return await getStatusColor(token, {key, value: n});;
  }
  return 'bg-green-500';
};

const formatValue = (value, key) => {
  if (value === undefined || value === null) return '-';
  
  // Format balance
  if (key === 'balance') {
    const numValue = Number(value);
    if (isNaN(numValue)) return String(value);
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  }
  
  // Format duration (detik)
  if (key === 'duration') {
    return `${value}s`;
  }
  
  return String(value);
};

const DemographyCard = ({ customer, displayMode = 'promotion' }) => {
  const { token } = useAuth();
  const [demographicsWithColor, setDemographicsWithColor] = useState([]);
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [insightGeneratedAt, setInsightGeneratedAt] = useState(null);

  const demographics = useMemo(() => [
    { label: 'Age', value: customer.age, type: 'age' },
    { label: 'Job', value: customer.job, type: 'text' },
    { label: 'Balance', value: customer.balance, type: 'numeric', key: 'balance' },
    { label: 'Campaign Status', value: customer.poutcome, type: 'text', key: 'poutcome'},
    { label: 'Total Campaign', value: customer.campaign, type: 'numeric', key: 'campaign'},
    { label: 'Total Contact', value: customer.previous, type: 'numeric', key: 'previous'},
    { label: 'Contact Duration', value: customer.duration, type: 'numeric', key: 'duration' },
    { label: 'Price Index', value: customer.cons_price_idx ?? customer["cons.price.idx"], type: 'numeric', key: 'cons_price_idx' },
    { label: 'Confidence Index', value: customer.cons_conf_idx ?? customer["cons.conf.idx"], type: 'numeric', key: 'cons_conf_idx' },
  ], [customer]);
  
  useEffect(() => {
    const loadColors = async () => {
      const enhanced = await Promise.all(
        demographics.map(async (d) => {
            const clean = Number(String(d.value).replace(/[^0-9.-]+/g, "")) || 0;
            const color = await statusColor(token, clean, d.type, d.key) ;
            return { ...d, color };
        })
      );

      setDemographicsWithColor(enhanced);
    };

    loadColors();
  }, [token, demographics]);

  // Insight generation is triggered manually to save tokens (trial)
  const generateInsight = async () => {
    try {
      setLoadingInsight(true);

      const customerData = {
        age: customer.age,
        job: customer.job,
        balance: customer.balance,
        poutcome: customer.poutcome,
        campaign: customer.campaign,
        duration: customer.duration,
        cons_price_idx: customer.cons_price_idx,
        cons_conf_idx: customer.cons_conf_idx
      };

      const result = await getCustomerInsight(token, customerData);
      const text = result?.data?.text || "";
      setInsight(text);
      // record generation timestamp for modal metadata
      setInsightGeneratedAt(text ? new Date() : null);
    } catch (err) {
      console.error('Failed to generate insight', err);
      setInsight('Failed to generate insight.');
    } finally {
      setLoadingInsight(false);
    }
  };


  if (!customer) return null;


  const probability = customer.probability ?? '0';
  const displayProbability = (() => {
    if (probability === null || probability === undefined) return '0%';
    const s = String(probability).trim();
    if (s.endsWith('%')) return s;
    // if numeric-like, append %
    if (!isNaN(Number(s))) return `${s}%`;
    return s;
  })();

  return (
    <div className="w-full bg-gray-50 rounded-lg p-6 border-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* top row: customerId (expandable) and badge to the right */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold truncate mr-3 w-full" title={customer.id}>{customer.id}</h3>
            {/* badge: purple when Priority, gray when not */}
            {(() => {
              const cat = (customer.category || '').toString();
              const isPriority = cat.trim().toLowerCase() === 'priority';
              return (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 ml-2 ${isPriority ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {cat || 'Unknown'}
                </span>
              );
            })()}
          </div>
          <p className="text-sm font-semibold text-gray-600 mt-3">{customer.name}</p>
        </div>
      </div>

      {/* simple non-blurred separator */}
      <div className="border-t border-gray-300 my-4 opacity-100" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Demografi</h4>
          <ul className="space-y-1 text-sm">
            {demographicsWithColor.map((d) => (
              <li key={d.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {d.label === 'Age' || d.label === 'Job' ? (
                    <span className="w-3 h-3 rounded-full shrink-0 invisible" />
                  ) : (
                    <span className={`${d.color} w-3 h-3 rounded-full shrink-0`} />
                  )}
                  <span className="text-gray-700">{d.label}</span>
                </div>
                <span className="text-gray-600 truncate max-w-[220px] text-right" title={formatValue(d.value, d.key)}>
                  {formatValue(d.value, d.key)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ml-7 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {displayProbability}
          </div>
          <div className="text-xs font-semibold text-gray-500 mt-2">Skor</div>

          {/* Inline AI Insight for dashboard: scrollable when long */}
          {displayMode === 'dashboard' && (
            <div className="mt-4 w-56 max-h-40 overflow-auto bg-amber-50 border border-amber-100 rounded-md p-3 text-left">
              <h5 className="font-semibold text-gray-800 text-sm">AI Insight</h5>
              <div className="mt-2">
                {loadingInsight ? (
                  <p className="text-sm text-gray-700">Loading insights...</p>
                ) : insight?.trim()?.length > 0 ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word">{insight.trim()}</p>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-700">No insight generated. Press</span>
                    <button
                      onClick={generateInsight}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700"
                    >
                      Generate
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Promotion (or default) view: compact box + Show more modal trigger */}
        {displayMode !== 'dashboard' && (
          <div className="mt-4 w-full bg-amber-50 border border-amber-100 rounded-md p-3 relative">
            <div className="flex items-start justify-between">
              <h5 className="font-semibold text-gray-800 text-sm">AI Insight</h5>
              {/* Show 'Show more' only when insight exists */}
              {insight?.trim()?.length > 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs text-gray-600 font-semibold hover:underline ml-2"
                  aria-label="Show more AI insight"
                >
                  Show more
                </button>
              )}
            </div>

            <div className="mt-2">
              {loadingInsight ? (
                <p className="text-sm text-gray-700">Loading insights...</p>
              ) : insight?.trim()?.length > 0 ? (
                <p className="text-sm text-gray-700 text-left whitespace-pre-wrap wrap-break-word max-h-20 overflow-hidden">{insight.trim()}</p>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-700">No insight generated. Press</span>
                  <button
                    onClick={generateInsight}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700"
                  >
                    Generate
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for full insight text (used in promotion view) */}
        {showModal && insight?.trim()?.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative z-10 w-[90%] max-w-2xl bg-white rounded-md shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">AI Insight</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <div>Customer ID: <span className="font-medium text-gray-700">{customer.id}</span></div>
                    <div>Customer Name: <span className="font-medium text-gray-700">{customer.name}</span></div>
                    <div>Generated: <span className="font-medium text-gray-700">{insightGeneratedAt ? new Date(insightGeneratedAt).toLocaleString() : '-'}</span></div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 ml-4"
                  aria-label="Close insight modal"
                >
                  Close
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-auto text-sm text-gray-700 whitespace-pre-wrap wrap-break-word">
                {loadingInsight ? 'Loading insights...' : insight?.trim()}
              </div>
            </div>
          </div>
        )}

      <div className="mt-4 text-xs text-gray-600">
        <div className="font-semibold mb-2">Information :</div>
        <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-red-500" /> <span>Red : Negative Value / Underperforming</span></div>
        <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-green-500" /> <span>Green : Good / High-Performing</span></div>
        <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-yellow-400" /> <span>Yellow : Need Attention</span></div>
      </div>
    </div>
  );
};

export default DemographyCard;