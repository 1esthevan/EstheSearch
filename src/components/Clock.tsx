import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);

  return (
    <div className="group cursor-pointer hover:skew-x-6 hover:-skew-y-6 hover:duration-500 duration-500 group-hover:duration-500 overflow-hidden relative rounded-2xl shadow-inner shadow-gray-50 flex flex-col justify-center items-center w-48 h-48 bg-black/30 backdrop-blur-variable text-gray-50 font-extrabold text-7xl">
      <span>{hours}</span>
      <span>{minutes}</span>
    </div>
  );
};

export default Clock;