import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXPIRY_MS = 1000 * 60 * 25; // 25 minutes

const AddedCustomerReminder = () => {
  const [entries, setEntries] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () => {
      try {
        // Prefer array of recent customers if present
        const rawArr = localStorage.getItem('lastAddedCustomers');
        if (rawArr) {
          try {
            const arr = JSON.parse(rawArr) || [];
            if (arr.length === 0) {
              setEntries([]);
              return;
            }
            // Filter expired entries
            const now = Date.now();
            const filtered = arr.filter((it) => (now - (it.ts || 0)) < EXPIRY_MS);
            
            if (filtered.length === 0) {
              localStorage.removeItem('lastAddedCustomers');
              setEntries([]);
              return;
            }
            
            // Update storage if we removed expired entries
            if (filtered.length !== arr.length) {
              localStorage.setItem('lastAddedCustomers', JSON.stringify(filtered));
            }
            
            setEntries(filtered);
            // Set remaining time based on oldest entry
            const oldest = filtered[filtered.length - 1];
            setRemaining(EXPIRY_MS - (now - (oldest.ts || 0)));
            return;
          } catch (e) {
            console.error('Failed parsing lastAddedCustomers', e);
          }
        }

        // fallback to single entry for backward compatibility
        const raw = localStorage.getItem('lastAddedCustomer');
        if (!raw) {
          setEntries([]);
          return;
        }
        const obj = JSON.parse(raw);
        if (!obj || !obj.ts) {
          setEntries([]);
          return;
        }
        const age = Date.now() - obj.ts;
        if (age >= EXPIRY_MS) {
          localStorage.removeItem('lastAddedCustomer');
          setEntries([]);
          return;
        }

        setEntries([obj]);
        setRemaining(EXPIRY_MS - age);
      } catch (e) {
        console.error('Failed reading lastAddedCustomer', e);
        setEntries([]);
      }
    };

    load();

    const t = setInterval(() => {
      try {
        const rawArr = localStorage.getItem('lastAddedCustomers');
        if (rawArr) {
          const arr = JSON.parse(rawArr) || [];
          if (arr.length === 0) {
            setEntries([]);
            setRemaining(0);
            return;
          }
          
          const now = Date.now();
          const filtered = arr.filter((it) => (now - (it.ts || 0)) < EXPIRY_MS);
          
          if (filtered.length === 0) {
            localStorage.removeItem('lastAddedCustomers');
            setEntries([]);
            setRemaining(0);
            return;
          }
          
          if (filtered.length !== arr.length) {
            localStorage.setItem('lastAddedCustomers', JSON.stringify(filtered));
          }
          
          setEntries(filtered);
          const oldest = filtered[filtered.length - 1];
          setRemaining(EXPIRY_MS - (now - (oldest.ts || 0)));
          return;
        }

        const raw = localStorage.getItem('lastAddedCustomer');
        if (!raw) {
          setEntries([]);
          setRemaining(0);
          return;
        }
        const obj = JSON.parse(raw);
        const age = Date.now() - (obj.ts || 0);
        if (age >= EXPIRY_MS) {
          localStorage.removeItem('lastAddedCustomer');
          setEntries([]);
          setRemaining(0);
        } else {
          setEntries([obj]);
          setRemaining(EXPIRY_MS - age);
        }
      } catch (e) {
        console.error('Failed parsing lastAddedCustomer(s)', e);
        setEntries([]);
        setRemaining(0);
      }
    }, 1000);

    return () => clearInterval(t);
  }, []);

  if (entries.length === 0) return null;

  const formatRemaining = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const oldest = entries[entries.length - 1];
  const elapsed = Math.max(0, Date.now() - (oldest.ts || 0));
  const pct = Math.min(100, Math.round((elapsed / EXPIRY_MS) * 100));

  const handleClose = () => {
    try { 
      localStorage.removeItem('lastAddedCustomers');
      localStorage.removeItem('lastAddedCustomer');
    } catch {}
    setEntries([]);
  };

  const handleRemoveOne = (entryId) => {
    try {
      const rawArr = localStorage.getItem('lastAddedCustomers');
      if (rawArr) {
        const arr = JSON.parse(rawArr) || [];
        const filtered = arr.filter((it) => it.id !== entryId);
        
        if (filtered.length > 0) {
          localStorage.setItem('lastAddedCustomers', JSON.stringify(filtered));
          setEntries(filtered);
        } else {
          localStorage.removeItem('lastAddedCustomers');
          localStorage.removeItem('lastAddedCustomer');
          setEntries([]);
        }
      }
    } catch(e) {
      console.error('Failed to remove entry', e);
    }
  };

  const totalCustomers = entries.length;
  const showMultiple = totalCustomers > 1;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-auto">
      <div className="w-80 rounded-lg shadow-lg overflow-hidden border border-yellow-300 bg-yellow-50">
        <div className="flex items-start gap-3 p-3">
          {/* Icon */}
          <div className="shrink-0">
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm">
              {showMultiple ? totalCustomers : '✓'}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-800">
              {showMultiple ? `${totalCustomers} new customers added` : 'New customer added'}
            </div>
            
            {/* Show list of customers */}
            <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
              {entries.map((entry, index) => (
                <div key={entry.id || index} className="flex items-center gap-1.5 text-xs text-gray-600 group">
                  <span className="font-medium truncate flex-1">
                    {entry.id} — {entry.name}
                  </span>
                  {showMultiple && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOne(entry.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 text-xs transition-opacity"
                      title="Remove this entry"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Access complete customer details through the Promotions menu or the Dashboard.
            </div>
            
            {/* Buttons */}
            <div className="mt-2 flex items-center gap-2">
              <button 
                onClick={() => navigate('/promotion')} 
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-colors"
              >
                Promotions
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>

          {/* Timer & Close */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <button 
              aria-label="Dismiss all" 
              onClick={handleClose} 
              className="text-gray-500 hover:text-gray-700 text-lg leading-none"
              title="Dismiss all"
            >
              ×
            </button>
            <div className="text-xs font-mono bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded">
              {formatRemaining(remaining)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-yellow-200">
          <div 
            className="h-1 bg-purple-500 transition-all duration-1000" 
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default AddedCustomerReminder