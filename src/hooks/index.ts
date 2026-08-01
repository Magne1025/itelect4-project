import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Custom hook to toggle a boolean value (e.g., show/hide, active/inactive).
 * Explicitly typed return tuple.
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);
  
  const toggle = useCallback((): void => {
    setValue((v) => !v);
  }, []);

  return [value, toggle];
}

/**
 * Custom hook to track the previous value of a state or prop.
 * Explicitly typed return value.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect((): void => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
