import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * @param {*} value - The input value to debounce
 * @param {number} delay - Timeout delay in milliseconds
 * @returns {*} debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
