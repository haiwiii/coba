import React from 'react';

const ProbabilityScore = ({ percentage }) => {
  
  // Score Color
  const getColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Progress Bar (smaller) */}
      <div className="w-10 md:w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(percentage)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {/* Percentage Text */}
      <span className="text-sm font-semibold text-gray-700 min-w-[2.6rem]">
        {percentage}%
      </span>
    </div>
  );
};

export default ProbabilityScore;