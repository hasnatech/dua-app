import React, { useEffect, useRef, useState } from 'react';
import { Pause } from 'lucide-react';

const INACTIVITY_TIME = 60; // seconds

const CircularTimer: React.FC = () => {
  const [time, setTime] = useState(INACTIVITY_TIME);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset inactivity timer on user activity
  const resetInactivity = () => {
    setTime(INACTIVITY_TIME);
    setIsPaused(false);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setIsPaused(true); // Stop timer after 60 sec idle
    }, INACTIVITY_TIME * 1000);
  };

  // Start countdown timer
  useEffect(() => {
    resetInactivity();

    const handleActivity = () => resetInactivity();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPaused && !isHovered) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            // resetInactivity();
            // return INACTIVITY_TIME;
             window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, isHovered]);

  // Circle calculation
  const radius = 16; // half of w-8 / h-8 with padding
  const circumference = 2 * Math.PI * radius;
  const progress = (time / INACTIVITY_TIME) * circumference;

  return (
    <div
      className="w-11 h-11 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
        <circle
          className="text-gray-300"
          strokeWidth="2"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="18"
          cy="18"
        />
        <circle
          className="text-blue-500"
          strokeWidth="2"
          stroke="#644F29"
          fill="transparent"
          r={radius}
          cx="18"
          cy="18"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference - progress}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-primary">
        {isHovered || isPaused ? <Pause className="w-4 h-4" /> : time}
      </div>
    </div>
  );
};

export default CircularTimer;
