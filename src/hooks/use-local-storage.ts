import { useEffect, useState } from 'react';

export const load = <T>(key: string): T | undefined => {
  const value = localStorage.getItem(key);

  try {
    if (value) {
      return JSON.parse(value) as T;
    }
  } catch (error) {
    console.warn(
      `⚠️ The ${key} value that is stored in localStorage is incorrect. Try to remove the value ${key} from localStorage and reload the page. ${JSON.stringify(error, null, 2)}`
    );
    return undefined;
  }
};

/**
 * A custom hook that synchronizes a state variable with localStorage.
 *
 * @template T - The type of the state variable.
 * @param {string} key - The key under which the value is stored in localStorage.
 * @param {T} initialValue - The initial value of the state variable.
 * @returns {[T, (value: T | ((val: T) => T)) => void]} An array containing the state and a setter function.
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Function to get the initial state from localStorage or use the initial value
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      // If running in a non-browser environment, return the initial value
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // If the item exists, parse and return it; otherwise, return the initial value
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Function to update the state and localStorage
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function to mimic useState's API
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Update state
      setStoredValue(valueToStore);
      // Update localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to localStorage (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window.localStorage) {
        setStoredValue(event.newValue ? (JSON.parse(event.newValue) as T) : initialValue);
      }
    };

    // Attach the event listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Clean up the event listener on unmount
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
