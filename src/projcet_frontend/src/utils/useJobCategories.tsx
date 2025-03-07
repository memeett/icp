import { useState, useEffect } from "react";
import { JobCategory } from "../interface/job/Job";
import { viewAllJobCategories } from "../controller/jobController";
import {
  getJobCategoriesCache,
  setJobCategoriesCache,
  resetJobCategoriesCache,
} from "./jobCategoriesCache";

// Create a cache object outside the hook to persist across component instances
let jobCategoriesCache = {
  data: null as JobCategory[] | null,
  loading: true,
  error: null as any,
};

export const useJobCategories = () => {
  const [state, setState] = useState(getJobCategoriesCache());

  const fetchCategories = async () => {
    // Skip if already cached
    if (jobCategoriesCache.data !== null || jobCategoriesCache.error) return;

    try {
      const result = await viewAllJobCategories();
      jobCategoriesCache = {
        data: result,
        loading: false,
        error: null,
      };
      setState(jobCategoriesCache);
    } catch (error) {
      jobCategoriesCache = {
        data: null,
        loading: false,
        error: error,
      };
      setState(jobCategoriesCache);
    }
  };

  const refresh = async () => {
    // Reset cache and fetch fresh data
    jobCategoriesCache = {
      data: null,
      loading: true,
      error: null,
    };
    setState(jobCategoriesCache);
    await fetchCategories();
  };

  useEffect(() => {
    // Only fetch if we don't have cached data
    if (!jobCategoriesCache.data && !jobCategoriesCache.error) {
      fetchCategories();
    }
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refresh,
  };
};
