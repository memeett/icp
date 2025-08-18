import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getFreelancerForRating, ratingUser, JobRatingPayload } from '../../controller/ratingController';
import { RequestRatingPayload } from '../../../../declarations/rating/rating.did';

export const useRating = (jobId: string | undefined, isJobOwner: boolean) => {
    const [ratingRecords, setRatingRecords] = useState<JobRatingPayload[]>([]);
    const [localRatings, setLocalRatings] = useState<Record<string, number>>({});
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [isRatingFinalized, setIsRatingFinalized] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchRatings = useCallback(async () => {
        if (isJobOwner && jobId) {
            setLoading(true);
            try {
                const ratings = await getFreelancerForRating(jobId);
                console.log(ratings)
                setRatingRecords(ratings);
                const initialRatings: Record<string, number> = {};
                ratings.forEach(r => {
                    initialRatings[r.user.id] = r.rating;
                });
                setLocalRatings(initialRatings);
                const allRated = ratings.every(r => r.isEdit);
                if (allRated) {
                    setIsRatingFinalized(true);
                }
            } catch (error) {
                console.error("Failed to fetch freelancer ratings:", error);
                message.error("Could not load ratings.");
            } finally {
                setLoading(false);
            }
        }
    }, [isJobOwner, jobId]);

    useEffect(() => {
        fetchRatings();
    }, [fetchRatings]);

    const handleRateChange = (freelancerId: string, value: number) => {
        setLocalRatings(prev => ({ ...prev, [freelancerId]: value }));
    };

    const handleFinalizeRatings = useCallback(async () => {
        const payloads: RequestRatingPayload[] = Object.entries(localRatings)
            .map(([userId, rating]) => {
                const record = ratingRecords.find(r => r.user.id === userId);
                if (record && !record.isEdit) {
                    return {
                        rating_id: record.rating_id.toString(),
                        rating: rating,
                    };
                }
                return null;
            })
            .filter((p): p is RequestRatingPayload => p !== null);

        if (payloads.length === 0) {
            message.info("No new ratings to submit or all ratings are final.");
            return;
        }

        setIsSubmittingRating(true);
        try {
            const result = await ratingUser(payloads);
            console.log(result)
            if (result.toLowerCase().includes("success")) {
                message.success("Ratings submitted successfully!");
                setIsRatingFinalized(true);
                await fetchRatings(); 
            } else {
                message.error(`Failed to submit ratings: ${result}`);
            }
        } catch (error) {
            console.error("Error finalizing ratings:", error);
            message.error("An unexpected error occurred while finalizing ratings.");
        } finally {
            setIsSubmittingRating(false);
        }
    }, [localRatings, ratingRecords, fetchRatings]);

    return {
        ratingRecords,
        localRatings,
        isSubmittingRating,
        isRatingFinalized,
        loading,
        handleRateChange,
        handleFinalizeRatings,
        fetchRatings
    };
};