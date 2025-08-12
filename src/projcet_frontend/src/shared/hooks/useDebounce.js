import { useState, useEffect } from 'react';
/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
/**
 * Custom hook that debounces a callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 */
export function useDebouncedCallback(callback, delay, deps = []) {
    const [debouncedCallback, setDebouncedCallback] = useState(() => callback);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCallback(() => callback);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [callback, delay, ...deps]);
    return debouncedCallback;
}
/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @returns Object with search value, debounced value, and setter
 */
export function useDebouncedSearch(initialValue = '', delay = 300) {
    const [searchValue, setSearchValue] = useState(initialValue);
    const debouncedSearchValue = useDebounce(searchValue, delay);
    return {
        searchValue,
        debouncedSearchValue,
        setSearchValue,
        isSearching: searchValue !== debouncedSearchValue,
    };
}
