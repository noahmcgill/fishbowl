import { useEffect, useState } from "react";

export const useDebouncedEffect = <T>(
  value: T,
  action: (val: T) => void,
  delay?: number,
) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      action(value);
    }, delay ?? 1000);

    return () => clearTimeout(handler);
  }, [value, action, delay]);

  return debouncedValue;
};
