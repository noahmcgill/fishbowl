import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that delays updating a state value until after a specified delay.
 * Useful for debouncing user input to prevent excessive function calls (e.g., API requests).
 *
 * @param value - The input value to debounce.
 * @param delay - The debounce delay in milliseconds (default: 500ms).
 * @returns The debounced value, which updates only after the delay period has passed, and
 * whether debouncing is occuring as a boolean.
 *
 * @example
 * const [debouncedSearch, isDebouncing] = useDebounce(searchTerm, 500);
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     fetchResults(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export const useDebounce = <T>(initial: T, delay?: number): [T, boolean] => {
  const [value, setValue] = useState<T>(initial);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      setIsDebouncing(true);
    }

    const handler = setTimeout(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      setValue(initial);
      setIsDebouncing(false);
    }, delay ?? 1000);

    return () => clearTimeout(handler);
  }, [delay, initial]);

  return [value, isDebouncing];
};
