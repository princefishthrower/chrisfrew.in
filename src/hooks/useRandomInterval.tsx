import {useRef, useEffect, useCallback} from "react"

// Utility helper for random number generation
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const useRandomInterval = (callback: () => void, minDelay: number | null, maxDelay: number | null) => {
  const timeoutId = useRef<number>(-1);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    if (minDelay !== null && maxDelay !== null) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = useCallback(function () {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};

export default useRandomInterval;