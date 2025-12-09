import React, { useState } from 'react';
import { addCustomer as addCustomerApi, calculateProbability } from '../../api/api';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuth } from '../../hooks/useAuth';

const defaultForm = {
  customerName: '',
  hasLoan: 'no',
  balance: 0,
  age: '',
  job: '',
  marital: 'single',
  education: '',
  defaultValue: 'no',
  housing: 'no',
  contact: 'cellular',
  month: '',
  day: '',
  duration: '',
  campaign: '',
  pdays: '',
  previous: '',
  poutcome: '',
  emp_var_rate: '',
  cons_price_idx: '',
  cons_conf_idx: '',
  euribor3m: '',
  nr_employed: '',
};

const CustomerEntryContainer = () => {
  const { refreshCustomers, setPage } = useCustomers();
  const { token } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [predictedScore, setPredictedScore] = useState(null);
  const [errors, setErrors] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  // no local reminder UI here; global AddedCustomerReminder component will display reminders

  const FIELD_INFO_EN = {
    "Customer Name": 
      "Enter the customer's full name as shown on their documents. Avoid abbreviations unless it is their legal format.",
    "Age": 
      "Customer's age in whole numbers. Must be greater than 0. Used for demographic and segmentation analysis.",
    "Job": 
      "Customer's occupation or job category (e.g., management, technician, admin, blue-collar). Helps classify economic status.",
    "Marital Status": 
      "Select marital status: single, married, or divorced. Useful for understanding household financial behavior.",
    "Education": 
      "Customer's highest completed education level: basic.4y, high.school, basic.6y, basic.9y, professional.course, unknown, university.degree, illiterate. Helps assess financial literacy trends.",
    "Personal Loan": 
      "Indicates whether the customer currently has any active personal loan. Select 'yes' or 'no'.",
    "Balance": 
      "Average annual account balance (in EUR). Helps measure customer liquidity and financial capacity.",
    "Housing Loan": 
      "Indicates whether the customer has an ongoing housing/mortgage loan. Select 'yes' or 'no'.",
    "Default (Delinquent Payment)": 
      "Shows if the customer has a history of credit/payment default. Select 'yes' if ever defaulted; otherwise 'no'.",
    "Contact Type": 
      "How the last contact was made: via cellular phone or landline telephone. Affects communication strategy.",
    "Last Contact Month": 
      "Month of the last contact with the customer (Jan–Dec). Used in marketing campaign timing analysis.",
    "Last Contact Day": 
      "The exact day of the month (Mon - Sun) when the last contact occurred.",
    "Contact Duration": 
      "Length of the last contact in seconds. Longer calls often indicate higher customer engagement.",
    "Total Campaign Contacts": 
      "Number of times this customer was contacted during the current campaign. Numeric.",
    "Days Since Last Contact": 
      "How many days since customer was previously contacted from an earlier campaign. Use -1 if never contacted.",
    "Previous Contacts": 
      "Total number of contacts made with this customer before the current campaign.",
    "Previous Campaign Result": 
      "Outcome of the previous marketing campaign: success, failure, or other.",
    "Consumer Price Index": 
      "Monthly Consumer Price Index value. Indicates inflation and affects customer purchasing power.",
    "Consumer Confidence Index": 
      "Monthly Consumer Confidence Index value. Reflects public optimism or pessimism regarding the economy.",
    "Euribor (3 Months)": 
      "Euribor 3-month interest rate. Used as an economic indicator influencing loan and savings behavior.",
    "Number of Employed": 
      "Quarterly employment index measuring the number of active workers. Higher values indicate stronger employment conditions.",
    "Employment Variation Rate": 
      "Employment variation rate (quarterly). Indicates changes in job market conditions, helpful in economic forecasting.",
  };

  const handleChange = (k) => (e) => {
    const val = e?.target?.value ?? e;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const validate = () => {
    const requiredFields = [
      'customerName', 'age', 'job', 'marital', 'education', 'defaultValue', 'balance', 'housing', 'hasLoan', 'contact', 'month', 'day', 'duration', 'campaign', 'pdays', 'previous', 'poutcome', 'emp_var_rate', 'cons_price_idx', 'cons_conf_idx', 'euribor3m', 'nr_employed'
    ];

    const nextErrors = {};
    requiredFields.forEach((k) => {
      const val = form[k];
      if (val === '' || val === null || typeof val === 'undefined') {
        nextErrors[k] = 'Field ini wajib diisi';
      } else if (k === 'age' && Number(val) <= 0) {
        nextErrors[k] = 'Masukkan usia yang valid (> 0)';
      } else if ((k === 'cons_price_idx' || k === 'cons_conf_idx' || k === 'euribor3m' || k === 'nr_employed' || k === 'emp_var_rate') && isNaN(Number(val))) {
        nextErrors[k] = 'Masukkan nilai numerik yang valid';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      setMessage('');
      setErrors({});
      const ok = validate();
      if (!ok) {
        setMessage('Please fill in all required fields before saving.');
        setSaving(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const payload = { ...form };

      // Convert to proper types - database expects integers for most fields
      payload.balance = Math.round(Number(payload.balance)) || 0;
      payload.age = Math.round(Number(payload.age)) || null;
      payload.duration = Math.round(Number(payload.duration)) || 0;
      payload.campaign = Math.round(Number(payload.campaign)) || 0;
      payload.pdays = Math.round(Number(payload.pdays)) || 999;
      payload.previous = Math.round(Number(payload.previous)) || 0;
      
      // These can be decimals
      payload.emp_var_rate = Number(payload.emp_var_rate) || null;
      payload.cons_price_idx = Number(payload.cons_price_idx) || null;
      payload.cons_conf_idx = Number(payload.cons_conf_idx) || null;
      payload.euribor3m = Number(payload.euribor3m) || null;
      payload.nr_employed = Number(payload.nr_employed) || null;
      
      // Prepare ML input - ML API expects string categorical values
      const mlInput = {
        age: Number(payload.age) || 0,
        job: String(payload.job),
        marital: String(payload.marital),
        education: String(payload.education),
        default: String(payload.defaultValue),
        housing: String(payload.housing),
        loan: String(payload.hasLoan),
        contact: String(payload.contact),
        month: String(payload.month),
        day_of_week: String(payload.day),
        duration: Number(payload.duration) || 0,
        campaign: Number(payload.campaign) || 0,
        pdays: (payload.pdays === '' || payload.pdays === null) ? -1 : Number(payload.pdays),
        previous: Number(payload.previous) || 0,
        poutcome: String(payload.poutcome),
        "emp.var.rate": Number(payload.emp_var_rate) || 0,
        "cons.price.idx": Number(payload.cons_price_idx) || 0,
        "cons.conf.idx": Number(payload.cons_conf_idx) || 0,
        euribor3m: Number(payload.euribor3m) || 0,
        "nr.employed": Number(payload.nr_employed) || 0,
        balance: Math.round(Number(payload.balance)) || 0
      };

      const predicted = await calculateProbability(mlInput);

      if (predicted?.error) {
        setMessage(`ML error: ${predicted.message || 'Failed to calculate probability'}`);
        setSaving(false);
        return;
      }

      const prob = Number(predicted.predicted ?? 0);
      payload.probability = prob;
      // expose predicted score to UI
      setPredictedScore(Math.round(prob));

      // Save to backend if token available
      if (token) {
        try {
          const res = await addCustomerApi(token, payload);
          if (res?.error) {
            setMessage(`Backend error: ${res.message || 'Server rejected the request'}`);
          } else {
            setMessage('Saved successfully.');
            // ensure score is shown immediately below the message
            if (predicted?.predicted != null) {
              setPredictedScore(Math.round(Number(predicted.predicted)));
            }

            // Persist a recent-added marker so the global reminder and table badge can show.
            console.debug('addCustomer response:', res?.data);
            try {
              const created = res?.data;
              const createdId = created?.id || created?.customerId || null;
              const createdName = created?.customerName || created?.name || payload.customerName || '';
              const ts = Date.now();

              const raw = localStorage.getItem('lastAddedCustomers');
              const EXPIRY_MS = 1000 * 60 * 15;
              let arr = [];
              if (raw) {
                arr = JSON.parse(raw) || [];
                arr = arr.filter((it) => (Date.now() - (it.ts || 0)) < EXPIRY_MS);
              }

              if (createdId) {
                arr.unshift({ id: String(createdId), name: createdName, ts });
                localStorage.setItem('lastAddedCustomer', JSON.stringify({ id: String(createdId), name: createdName, ts }));
              } else {
                const tmpId = `tmp-${ts}`;
                arr.unshift({ id: tmpId, name: createdName || payload.customerName || 'New Customer', ts });
                localStorage.setItem('lastAddedCustomer', JSON.stringify({ id: tmpId, name: createdName || payload.customerName || 'New Customer', ts }));
                console.debug('No createdId returned; persisted temporary recent-customer', tmpId);
              }

              if (arr.length > 10) arr = arr.slice(0, 10);
              localStorage.setItem('lastAddedCustomers', JSON.stringify(arr));
              console.debug('Persisted lastAddedCustomers:', arr);
            } catch (err) {
              console.error('Failed to store lastAddedCustomer', err);
            }

            // Ensure UI shows newest customers: move to page 1 then refresh
            try {
              setPage(1);
            } catch {}

            // Give React state a tick to update page, then refresh list
            setTimeout(() => {
              try {
                refreshCustomers();
              } catch {}
            }, 150);

            setForm(defaultForm);
          }
        } catch (err) {
          console.error(err);
          setMessage('Saved locally; failed to send to server.');
        }
      } else {
        setMessage('Saved locally (no auth token).');
      }
    } finally {
      setSaving(false);
    }
  };

    return (
    <main className="flex-1 flex flex-col gap-6 pr-2 min-w-0">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3 flex items-center gap-3">
              <span>Customer Entry</span>
              <button
                type="button"
                onClick={() => setShowInfoModal(true)}
                aria-label="Field information"
                title="Field information"
                className="w-6 h-6 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center text-white text-sm font-semibold transition-colors shadow-sm"
              >
                i
              </button>
            </h2>
            <p className="text-gray-600 text-lg mb-6">Add new customers to your system and manage customer information</p>
          </div>
        </div>

        {showInfoModal && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-[min(900px,95%)] max-h-[90vh] overflow-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customer Entry - Field Descriptions</h3>
                <button type="button" onClick={() => setShowInfoModal(false)} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                {Object.entries(FIELD_INFO_EN).map(([key, text]) => (
                  <div key={key} className="p-3 border rounded bg-gray-50">
                    <div className="font-semibold text-sm mb-1">{key}</div>
                    <div className="text-xs text-gray-600">{text}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-right">
                <button type="button" onClick={() => setShowInfoModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Got it</button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Customer Name <span className="text-red-500">*</span></span>
            </label>
            <input value={form.customerName} onChange={handleChange('customerName')} className={`w-full border rounded px-3 py-2 ${errors.customerName ? 'border-orange-400 border-2' : ''}`} />
            {errors.customerName && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.customerName && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Age <span className="text-red-500">*</span></span>
            </label>
            <input type="number" value={form.age} onChange={handleChange('age')} className={`w-full border rounded px-3 py-2 ${errors.age ? 'border-orange-400 border-2' : ''}`} />
            {errors.age && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.age && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Job <span className="text-red-500">*</span></span>
            </label>
            <select value={form.job} onChange={handleChange('job')} className={`w-full border rounded px-3 py-2 ${errors.job ? 'border-orange-400 border-2' : ''}`}>
              <option value="">Select job</option>
              <option value="admin.">admin.</option>
              <option value="blue-collar">blue-collar</option>
              <option value="entrepreneur">entrepreneur</option>
              <option value="housemaid">housemaid</option>
              <option value="management">management</option>
              <option value="retired">retired</option>
              <option value="self-employed">self-employed</option>
              <option value="services">services</option>
              <option value="student">student</option>
              <option value="technician">technician</option>
              <option value="unemployed">unemployed</option>
              <option value="unknown">unknown</option>
            </select>
            {errors.job && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.job && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Marital Status <span className="text-red-500">*</span></span>
            </label>
            <select value={form.marital} onChange={handleChange('marital')} className={`w-full border rounded px-3 py-2 ${errors.marital ? 'border-orange-400 border-2' : ''}`}>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="unknown">Unknown</option>
            </select>
            {errors.marital && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.marital && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Education <span className="text-red-500">*</span></span>
            </label>
            <select value={form.education} onChange={handleChange('education')} className={`w-full border rounded px-3 py-2 ${errors.education ? 'border-orange-400 border-2' : ''}`}>
              <option value="">Select education level</option>
              <option value="basic.4y">basic.4y</option>
              <option value="high.school">high.school</option>
              <option value="basic.6y">basic.6y</option>
              <option value="basic.9y">basic.9y</option>
              <option value="professional.course">professional.course</option>
              <option value="unknown">unknown</option>
              <option value="university.degree">university.degree</option>
              <option value="illiterate">illiterate</option>
            </select>
            {errors.education && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.education && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Personal Loan <span className="text-red-500">*</span></span>
            </label>
            <select value={form.hasLoan} onChange={handleChange('hasLoan')} className={`w-full border rounded px-3 py-2 ${errors.hasLoan ? 'border-orange-400 border-2' : ''}`}>
              <option value="no">no</option>
              <option value="yes">yes</option>
              <option value="unknown">unknown</option>
            </select>
            {errors.hasLoan && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.hasLoan && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Balance (annual average, EUR) <span className="text-red-500">*</span></span>
            </label>
            <input type="number" step="1" value={form.balance} onChange={handleChange('balance')} className={`w-full border rounded px-3 py-2 ${errors.balance ? 'border-orange-400 border-2' : ''}`} placeholder="e.g., 2552" />
            {errors.balance && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.balance && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Housing Loan <span className="text-red-500">*</span></span>
            </label>
            <select value={form.housing} onChange={handleChange('housing')} className={`w-full border rounded px-3 py-2 ${errors.housing ? 'border-orange-400 border-2' : ''}`}>
              <option value="no">no</option>
              <option value="yes">yes</option>
              <option value="unknown">unknown</option>
            </select>
            {errors.housing && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.housing && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Default (delinquent payment) <span className="text-red-500">*</span></span>
            </label>
            <select value={form.defaultValue} onChange={handleChange('defaultValue')} className={`w-full border rounded px-3 py-2 ${errors.defaultValue ? 'border-orange-400 border-2' : ''}`}>
              <option value="no">no</option>
              <option value="yes">yes</option>
              <option value="unknown">unknown</option>
            </select>
            {errors.defaultValue && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.defaultValue && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Contact Type <span className="text-red-500">*</span></span>
            </label>
            <select value={form.contact} onChange={handleChange('contact')} className={`w-full border rounded px-3 py-2 ${errors.contact ? 'border-orange-400 border-2' : ''}`}>
              <option value="cellular">cellular</option>
              <option value="telephone">telephone</option>
            </select>
            {errors.contact && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.contact && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Last Contact Month <span className="text-red-500">*</span></span>
            </label>
            <select value={form.month} onChange={handleChange('month')} className={`w-full border rounded px-3 py-2 ${errors.month ? 'border-orange-400 border-2' : ''}`}>
              <option value="">Select month</option>
              <option value="jan">Jan</option>
              <option value="feb">Feb</option>
              <option value="mar">Mar</option>
              <option value="apr">Apr</option>
              <option value="may">May</option>
              <option value="jun">Jun</option>
              <option value="jul">Jul</option>
              <option value="aug">Aug</option>
              <option value="sep">Sep</option>
              <option value="oct">Oct</option>
              <option value="nov">Nov</option>
              <option value="dec">Dec</option>
            </select>
            {errors.month && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.month && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mt-4">
              <span>Last Contact Day <span className="text-red-500">*</span></span>
            </label>
            <select value={form.day} onChange={handleChange('day')} className={`w-full border rounded px-3 py-2 ${errors.day ? 'border-orange-400 border-2' : ''}`}>
              <option value="">Select day</option>
              <option value="mon">Mon</option>
              <option value="tue">Tue</option>
              <option value="wed">Wed</option>
              <option value="thu">Thu</option>
              <option value="fri">Fri</option>
              <option value="sat">Sat</option>
              <option value="sun">Sun</option>
            </select>
            {errors.day && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.day && <div className="text-xs text-gray-400 mt-1">This field is required</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Contact Duration (seconds) <span className="text-red-500">*</span></span>
            </label>
            <input type="number" step="1" value={form.duration} onChange={handleChange('duration')} className={`w-full border rounded px-3 py-2 ${errors.duration ? 'border-orange-400 border-2' : ''}`} placeholder="e.g., 125" />
            {errors.duration && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-3 py-2"><span className="text-orange-500 text-lg font-bold">!</span><span className="text-sm text-orange-700">Please fill out this field.</span></div>}
            {!errors.duration && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
          </div>

          {/* Wide area for advanced numeric fields */}
          <div className="md:col-span-2 mt-3 bg-gray-50 border rounded p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Advanced Fields</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600">Total Campaign Contacts <span className="text-red-500">*</span></label>
                <input type="number" step="1" value={form.campaign} onChange={handleChange('campaign')} className={`w-full border rounded px-2 py-2 ${errors.campaign ? 'border-orange-400 border-2' : ''}`} placeholder="e.g., 3" />
                {errors.campaign && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.campaign && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Previous Contacts <span className="text-red-500">*</span></label>
                <input type="number" step="1" value={form.previous} onChange={handleChange('previous')} className={`w-full border rounded px-2 py-2 ${errors.previous ? 'border-orange-400 border-2' : ''}`} placeholder="e.g., 0" />
                {errors.previous && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.previous && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Days Since Last Contact (-1 = never) <span className="text-red-500">*</span></label>
                <input type="number" step="1" value={form.pdays} onChange={handleChange('pdays')} className={`w-full border rounded px-2 py-2 ${errors.pdays ? 'border-orange-400 border-2' : ''}`} placeholder="e.g., 999" />
                {errors.pdays && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.pdays && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>

              <div>
                <label className="text-xs text-gray-600">Last Campaign Result <span className="text-red-500">*</span></label>
                <select value={form.poutcome} onChange={handleChange('poutcome')} className={`w-full border rounded px-2 py-2 ${errors.poutcome ? 'border-orange-400 border-2' : ''}`}>
                  <option value="">Select result</option>
                  <option value="success">success</option>
                  <option value="failure">failure</option>
                  <option value="nonexistent">nonexistent</option>
                </select>
                {errors.poutcome && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.poutcome && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Employment Variation Rate <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.emp_var_rate} onChange={handleChange('emp_var_rate')} className={`w-full border rounded px-2 py-2 ${errors.emp_var_rate ? 'border-orange-400 border-2' : ''}`} />
                {errors.emp_var_rate && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.emp_var_rate && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Consumer Price Index <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.cons_price_idx} onChange={handleChange('cons_price_idx')} className={`w-full border rounded px-2 py-2 ${errors.cons_price_idx ? 'border-orange-400 border-2' : ''}`} />
                {errors.cons_price_idx && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.cons_price_idx && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>

              <div>
                <label className="text-xs text-gray-600">Consumer Confidence Index <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.cons_conf_idx} onChange={handleChange('cons_conf_idx')} className={`w-full border rounded px-2 py-2 ${errors.cons_conf_idx ? 'border-orange-400 border-2' : ''}`} />
                {errors.cons_conf_idx && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.cons_conf_idx && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Euribor 3 Month Rate <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.euribor3m} onChange={handleChange('euribor3m')} className={`w-full border rounded px-2 py-2 ${errors.euribor3m ? 'border-orange-400 border-2' : ''}`} />
                {errors.euribor3m && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.euribor3m && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Number of Employees <span className="text-red-500">*</span></label>
                <input type="number" step="1" value={form.nr_employed} onChange={handleChange('nr_employed')} className={`w-full border rounded px-2 py-2 ${errors.nr_employed ? 'border-orange-400 border-2' : ''}`} />
                {errors.nr_employed && <div className="flex items-center gap-2 mt-2 bg-orange-50 border border-orange-300 rounded px-2 py-1"><span className="text-orange-500 font-bold text-sm">!</span><span className="text-xs text-orange-700">Please fill out this field.</span></div>}
                {!errors.nr_employed && <div className="text-xs text-gray-400 mt-1">This field is required</div>}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              <div>{message}</div>
              {predictedScore !== null && (
                <div className="text-xs text-gray-600 mt-1">Predicted score: <span className="font-medium">{predictedScore}%</span></div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setForm(defaultForm)} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{saving ? 'Saving...' : 'Save Customer'}</button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CustomerEntryContainer;