import { useState, useEffect } from "react";
import { viewAllJobCategories } from "../controller/jobController";
export const useJobCategories = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching categories from backend...');
            const result = await viewAllJobCategories();
            console.log('Categories result:', result);
            setData(result);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            setError(error);
            setData(null);
            setLoading(false);
        }
    };
    const refresh = async () => {
        await fetchCategories();
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    return {
        data,
        loading,
        error,
        refresh,
    };
};
