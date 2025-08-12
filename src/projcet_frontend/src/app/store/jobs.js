import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
// Jobs data atoms
export const jobsAtom = atom([]);
export const jobCategoriesAtom = atom([]);
export const selectedJobAtom = atom(null);
// Job applications atoms
export const jobApplicationsAtom = atom([]);
export const userApplicationsAtom = atom([]);
// Job submissions atoms
export const jobSubmissionsAtom = atom([]);
// Job filters atoms
export const jobFiltersAtom = atom({
    categories: [],
    priceRanges: [],
    experienceLevel: [],
    jobType: [],
    sortBy: 'newest',
});
// Search and pagination atoms
export const jobSearchQueryAtom = atom('');
export const jobsCurrentPageAtom = atom(1);
export const jobsPerPageAtom = atom(12);
// Derived atoms for filtered jobs
export const filteredJobsAtom = atom((get) => {
    const jobs = get(jobsAtom);
    const searchQuery = get(jobSearchQueryAtom);
    const filters = get(jobFiltersAtom);
    let filtered = jobs.filter(job => job.jobStatus !== 'Finished');
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(job => job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.jobDescription.some(desc => desc.toLowerCase().includes(searchQuery.toLowerCase())));
    }
    // Apply category filter
    if (filters.categories.length > 0) {
        filtered = filtered.filter(job => job.jobTags.some(tag => filters.categories.includes(tag.jobCategoryName)));
    }
    // Apply price range filter
    if (filters.priceRanges.length > 0) {
        filtered = filtered.filter(job => {
            return filters.priceRanges.some(range => {
                const [min, max] = range === '2000+'
                    ? [2000, Infinity]
                    : range.split('-').map(Number);
                return job.jobSalary >= min && job.jobSalary < max;
            });
        });
    }
    // Apply experience level filter
    if (filters.experienceLevel.length > 0) {
        filtered = filtered.filter(job => job.experienceLevel && filters.experienceLevel.includes(job.experienceLevel));
    }
    // Apply job type filter
    if (filters.jobType.length > 0) {
        filtered = filtered.filter(job => job.jobType && filters.jobType.includes(job.jobType));
    }
    // Apply sorting
    switch (filters.sortBy) {
        case 'newest':
            filtered.sort((a, b) => Number(b.createdAt - a.createdAt));
            break;
        case 'oldest':
            filtered.sort((a, b) => Number(a.createdAt - b.createdAt));
            break;
        case 'salary_high':
            filtered.sort((a, b) => b.jobSalary - a.jobSalary);
            break;
        case 'salary_low':
            filtered.sort((a, b) => a.jobSalary - b.jobSalary);
            break;
        case 'deadline':
            filtered.sort((a, b) => {
                if (!a.deadline && !b.deadline)
                    return 0;
                if (!a.deadline)
                    return 1;
                if (!b.deadline)
                    return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            });
            break;
    }
    return filtered;
});
// Paginated jobs atom
export const paginatedJobsAtom = atom((get) => {
    const filtered = get(filteredJobsAtom);
    const currentPage = get(jobsCurrentPageAtom);
    const perPage = get(jobsPerPageAtom);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filtered.slice(startIndex, endIndex);
});
// Job statistics atoms
export const jobStatsAtom = atom((get) => {
    const jobs = get(jobsAtom);
    return {
        total: jobs.length,
        open: jobs.filter(job => job.jobStatus === 'Open').length,
        inProgress: jobs.filter(job => job.jobStatus === 'In Progress').length,
        completed: jobs.filter(job => job.jobStatus === 'Completed').length,
        totalValue: jobs.reduce((sum, job) => sum + job.jobSalary, 0),
    };
});
// Recommendation atoms
export const recommendedJobsAtom = atom([]);
export const recommendationStartIndexAtom = atom(0);
// Job actions atom
export const jobActionsAtom = atom(null, (get, set, action) => {
    switch (action.type) {
        case 'SET_JOBS':
            set(jobsAtom, action.jobs);
            break;
        case 'ADD_JOB':
            set(jobsAtom, (prev) => [...prev, action.job]);
            break;
        case 'UPDATE_JOB':
            set(jobsAtom, (prev) => prev.map(job => job.id === action.jobId ? { ...job, ...action.updates } : job));
            break;
        case 'DELETE_JOB':
            set(jobsAtom, (prev) => prev.filter(job => job.id !== action.jobId));
            break;
        case 'SET_CATEGORIES':
            set(jobCategoriesAtom, action.categories);
            break;
        case 'SET_SELECTED_JOB':
            set(selectedJobAtom, action.job);
            break;
        case 'SET_RECOMMENDATIONS':
            set(recommendedJobsAtom, action.jobs);
            break;
        case 'UPDATE_FILTERS':
            set(jobFiltersAtom, (prev) => ({ ...prev, ...action.filters }));
            break;
    }
});
// Saved jobs atom (for bookmarking)
export const savedJobsAtom = atomWithStorage('savedJobs', []);
export const isSavedJobAtom = atom((get) => (jobId) => get(savedJobsAtom).includes(jobId), (get, set, { jobId, save }) => {
    const saved = get(savedJobsAtom);
    if (save && !saved.includes(jobId)) {
        set(savedJobsAtom, [...saved, jobId]);
    }
    else if (!save && saved.includes(jobId)) {
        set(savedJobsAtom, saved.filter(id => id !== jobId));
    }
});
