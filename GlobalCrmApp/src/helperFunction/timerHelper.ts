import { useState, useEffect } from 'react';

export const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000); // Increment every second
    } else if (!isRunning && elapsedTime !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    const endTime = new Date();
    return { startTime, endTime, elapsedTime };
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { isRunning, isPaused, elapsedTime, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime };
};