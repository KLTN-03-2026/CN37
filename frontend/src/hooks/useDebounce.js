import { useState, useEffect } from 'react';

/**
 * Custom hook để debounce giá trị
 * @param {string} value - Giá trị cần debounce
 * @param {number} delay - Thời gian debounce (ms) - mặc định 300ms
 * @returns {string} Giá trị đã debounce
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
