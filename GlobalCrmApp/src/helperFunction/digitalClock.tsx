import React, { useEffect, useState } from 'react';

interface DigitalClockProps {
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ elapsedTime, isRunning, isPaused }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime(new Date(time.getTime() + 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, time]);

  useEffect(() => {
    const newTime = new Date();
    newTime.setSeconds(newTime.getSeconds() + elapsedTime);
    setTime(newTime);
  }, [elapsedTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ fontSize: '1.5rem', textAlign: 'center' }}>
      {formatTime(elapsedTime)}
    </div>
  );
};

export default DigitalClock;