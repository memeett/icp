let cache = {
    data: null,
    loading: true,
    error: null,
};
export const getJobCategoriesCache = () => cache;
export const setJobCategoriesCache = (newState) => {
    cache = { ...cache, ...newState };
};
export const resetJobCategoriesCache = () => {
    cache = {
        data: null,
        loading: true,
        error: null,
    };
};
