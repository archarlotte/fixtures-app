import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of `value` that only updates
 * after `delay` ms of no changes.
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
