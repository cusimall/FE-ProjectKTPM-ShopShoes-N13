import React, { useState, useEffect, useRef } from "react";
import "../../styles/clock.css";

const Clock = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const countDown = () => {
    const currentYear = new Date().getFullYear();
    const destination = new Date(`December 31, ${currentYear}`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const different = destination - now;

      if (different < 0) {
        clearInterval(intervalRef.current);
        return;
      }

      const days = Math.floor(different / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (different % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((different % (1000 * 60)) / 1000);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    };

    // Update immediately
    updateTimer();
    
    // Then update every second
    intervalRef.current = setInterval(updateTimer, 1000);
  };

  useEffect(() => {
    countDown();
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="clock__wrapper d-flex align-items-center gap-3">
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{days}</h1>
          <h5 className="text-white fs-6">Ngày</h5>
        </div>
        <span className="text-white fs-3 mb-2">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{hours}</h1>
          <h5 className="text-white fs-6">Giờ</h5>
        </div>
        <span className="text-white fs-3 mb-2">:</span>
      </div>
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{minutes}</h1>
          <h5 className="text-white fs-6">Phút</h5>
        </div>
        <span className="text-white fs-3 mb-2">:</span>
      </div>
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{seconds}</h1>
          <h5 className="text-white fs-6">Giây</h5>
        </div>
      </div>
    </div>
  );
};

export default Clock;
