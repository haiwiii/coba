import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
      />
    </div>
  );
};

export default SearchBar;