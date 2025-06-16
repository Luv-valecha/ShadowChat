import React from 'react';

const StatCardSkeleton = () => {
  return (
    <div className="bg-black p-4 rounded-xl shadow text-center animate-pulse space-y-2 m-10 mt-25">
      <div className="h-40 bg-gray-700 rounded w-1/2 mx-auto"></div>
      <div className="h-60 bg-gray-700 rounded w-1/3 mx-auto"></div>
    </div>
  );
};

export default StatCardSkeleton;
