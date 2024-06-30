import React from 'react';

const Spinner = () => {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="animate-spin h-10 w-10 md:h-16 md:w-16 lg:h-20 lg:w-20 border-4 rounded-full border-t-transparent border-slate-500"></div>
    </div>
  );
};

export default Spinner;
