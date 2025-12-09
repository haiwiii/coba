import { useEffect, useState } from "react";

function Input({ label, type, accept, value, maxLength, onChange, required }) {

    const [inputType, setInputType] = useState(type);

    useEffect(() => {
        setInputType(type);
    }, [type]);

    function toggleRevealPassword() {
        setInputType((prev) => (prev === "password" ? "text" : "password"));
    }
    
    return (
        <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 self-start">{label}</label>
            <div className="relative w-full">
                <input
                    type={inputType || 'text'}
                    accept={accept || undefined}
                    maxLength={maxLength || undefined}
                    placeholder="Type here"
                    value={value}
                    onChange={onChange}
                    required={ required ? required : true }
                    className={`w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 ${value ? 'text-gray-800' : 'text-gray-500'}`}
                />

                {label === 'Password' && (
                    <button
                        type="button"
                        onClick={toggleRevealPassword}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition-colors"
                        aria-label="toggle password visibility"
                    >
                        {inputType === 'password' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 1024 1024" fill="currentColor"><path d="M508 624a112 112 0 0 0 112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43m370.72-458.44L836 122.88a8 8 0 0 0-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 0 0 0 11.31L155.25 889a8 8 0 0 0 11.31 0l712.16-712.12a8 8 0 0 0 0-11.32M332 512a176 176 0 0 1 258.88-155.28l-48.62 48.62a112.08 112.08 0 0 0-140.92 140.92l-48.62 48.62A175.1 175.1 0 0 1 332 512"/><path d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 0 1 445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5"/></svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Input;
