import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ratingUser } from "../../controller/ratingController";
export default function RatingSection({ ratings, onFinish }) {
    // Deduplicate ratings by user ID
    const [uniqueRatings, setUniqueRatings] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [currentRatingIndex, setCurrentRatingIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [animationDirection, setAnimationDirection] = useState("");
    const [ratedUsers, setRatedUsers] = useState({});
    // Deduplicate ratings on component mount
    useEffect(() => {
        if (ratings.length > 0) {
            // Use a Map to deduplicate by user ID
            const uniqueMap = new Map();
            ratings.forEach(rating => {
                const userId = String(rating.user.id);
                // Only add if not already in the map
                if (!uniqueMap.has(userId)) {
                    uniqueMap.set(userId, rating);
                }
            });
            // Convert map values to array
            const deduplicatedRatings = Array.from(uniqueMap.values());
            console.log("Original ratings count:", ratings.length);
            console.log("Deduplicated ratings count:", deduplicatedRatings.length);
            setUniqueRatings(deduplicatedRatings);
        }
    }, [ratings]);
    // Initialize selectedRating with current rating value or from previously rated users
    useEffect(() => {
        if (uniqueRatings.length > 0) {
            const ratingId = String(uniqueRatings[currentRatingIndex].rating_id);
            if (ratedUsers[ratingId]) {
                setSelectedRating(ratedUsers[ratingId]);
            }
            else {
                setSelectedRating(uniqueRatings[currentRatingIndex].rating || 0);
            }
        }
    }, [currentRatingIndex, uniqueRatings, ratedUsers]);
    // Don't render anything if there are no ratings
    if (uniqueRatings.length === 0)
        return null;
    // Function to go to previous freelancer with data preservation
    const handlePrevious = () => {
        if (currentRatingIndex > 0) {
            setAnimationDirection("left");
            setTimeout(() => {
                setCurrentRatingIndex((prev) => prev - 1);
                setTimeout(() => setAnimationDirection(""), 50);
            }, 200);
        }
    };
    // Function to go to next freelancer with data preservation
    const handleNext = () => {
        if (currentRatingIndex < uniqueRatings.length - 1) {
            // Store current rating before moving
            const currentRatingId = String(uniqueRatings[currentRatingIndex].rating_id);
            setRatedUsers(prev => ({
                ...prev,
                [currentRatingId]: selectedRating
            }));
            setAnimationDirection("right");
            setTimeout(() => {
                setCurrentRatingIndex((prev) => prev + 1);
                setTimeout(() => setAnimationDirection(""), 50);
            }, 200);
        }
    };
    const handleSubmitRating = async () => {
        if (selectedRating === 0) {
            // alert("Please select a rating before proceeding.");
            return;
        }
        setIsSubmitting(true);
        const currentRatingId = String(uniqueRatings[currentRatingIndex].rating_id);
        try {
            const result = await ratingUser(currentRatingId, selectedRating);
            if (result === "Success") {
                setRatedUsers(prev => ({
                    ...prev,
                    [currentRatingId]: selectedRating
                }));
                if (currentRatingIndex < uniqueRatings.length - 1) {
                    setAnimationDirection("right");
                    setTimeout(() => {
                        setCurrentRatingIndex((prev) => prev + 1);
                        setTimeout(() => setAnimationDirection(""), 50);
                    }, 200);
                }
                else {
                    onFinish();
                }
            }
        }
        catch (error) {
            console.error("Rating submission error:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Skip to finish (optional)
    const handleFinish = () => {
        const unansweredRatings = uniqueRatings.filter((_, index) => index > currentRatingIndex ||
            !ratedUsers[String(uniqueRatings[currentRatingIndex].rating_id)]);
        if (unansweredRatings.length > 0) {
            if (window.confirm(`You have ${unansweredRatings.length} unrated freelancers. Are you sure you want to finish?`)) {
                onFinish();
            }
        }
        else {
            onFinish();
        }
    };
    const getRatingLabel = (rating) => {
        switch (rating) {
            case 1: return "Poor";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Very Good";
            case 5: return "Excellent";
            default: return "Select Rating";
        }
    };
    const getCurrentFreelancer = () => {
        return uniqueRatings[currentRatingIndex]?.user?.username || "Freelancer";
    };
    const getUserProfilePicture = () => {
        const picture = uniqueRatings[currentRatingIndex]?.user?.profilePicture;
        if (picture) {
            try {
                return URL.createObjectURL(picture);
            }
            catch (error) {
                console.error("Error creating URL for profile picture:", error);
                return null;
            }
        }
        return null;
    };
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8 mt-8 max-w-md mx-auto border border-gray-100", children: [_jsx("h2", { className: "text-2xl font-bold text-indigo-800 mb-6 text-center", children: "Rate Your Freelancers" }), _jsxs("div", { className: "relative mb-8", children: [_jsx("div", { className: "w-full bg-gray-200 h-1 absolute top-4" }), _jsx("div", { className: "flex justify-between relative", children: Array.from({ length: uniqueRatings.length }).map((_, idx) => {
                            const isRated = ratedUsers[String(uniqueRatings[idx].rating_id)];
                            return (_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors
                  ${isRated ? 'bg-green-600 text-white' :
                                    idx === currentRatingIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`, children: idx + 1 }, idx));
                        }) })] }), _jsxs("div", { className: `transition-opacity duration-200 ${animationDirection ? 'opacity-0' : 'opacity-100'}`, children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-indigo-100 shadow-md", children: getUserProfilePicture() ? (_jsx("img", { src: getUserProfilePicture(), alt: "Profile", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-2xl font-bold", children: getCurrentFreelancer().charAt(0).toUpperCase() })) }) }), _jsx("h3", { className: "text-xl font-semibold text-center mb-2", children: getCurrentFreelancer() }), _jsx("div", { className: "flex justify-center gap-3 mb-2", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { onClick: () => setSelectedRating(star), "aria-label": `Rate ${star} stars`, className: `text-4xl transition-all duration-200 hover:scale-125 focus:outline-none
                ${star <= selectedRating ? 'text-yellow-400' : 'text-gray-300'}`, children: "\u2605" }, star))) }), _jsx("p", { className: "text-center text-indigo-700 font-medium mb-8", children: getRatingLabel(selectedRating) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("button", { onClick: handlePrevious, disabled: currentRatingIndex === 0 || isSubmitting, className: "px-4 py-2 rounded-lg transition-colors flex items-center \n                   disabled:opacity-50 text-indigo-700 hover:bg-indigo-50", "aria-label": "Go to previous freelancer", children: "\u2190 Previous" }), _jsxs("span", { className: "text-gray-500 font-medium", children: [currentRatingIndex + 1, " of ", uniqueRatings.length] }), _jsxs("div", { className: "flex gap-2", children: [currentRatingIndex < uniqueRatings.length - 1 && (_jsx("button", { onClick: handleNext, className: "px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 \n                       transition-colors shadow-sm disabled:opacity-70", disabled: isSubmitting, "aria-label": "Skip to next freelancer without rating", children: "Skip" })), _jsx("button", { onClick: handleSubmitRating, className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 \n                     transition-colors shadow-md disabled:opacity-70", disabled: isSubmitting || selectedRating === 0, "aria-label": currentRatingIndex === uniqueRatings.length - 1 ? "Submit rating and finish" : "Submit rating and go to next", children: isSubmitting ? (_jsxs("span", { className: "flex items-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Submitting"] })) : (currentRatingIndex === uniqueRatings.length - 1 ? 'Finish' : 'Submit') })] })] }), uniqueRatings.length > 3 && currentRatingIndex < uniqueRatings.length - 1 && (_jsx("div", { className: "mt-6 text-center", children: _jsx("button", { onClick: handleFinish, className: "text-gray-500 hover:text-indigo-600 text-sm", disabled: isSubmitting, children: "Skip all and finish" }) }))] }));
}
