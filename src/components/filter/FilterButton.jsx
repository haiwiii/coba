import React from 'react';
import { Filter } from "lucide-react";

const FilterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-md"
    >
      <Filter className="w-5 h-5" />
      <span>Filter</span>
    </button>
  );
};

export default FilterButton;