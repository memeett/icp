import { userclicked } from "../../../declarations/userclicked";
export const addIncrementUserClicked = async (jobId) => {
    const userData = localStorage.getItem("current_user");
    if (userData) {
        const parsedData = JSON.parse(userData);
        const resUserClicked = await userclicked.getUserClickedByUserIdJobId(parsedData.ok.id, jobId);
        if (resUserClicked.length == 0) {
            const res = await userclicked.createUserClicked(parsedData.ok.id, jobId);
            if ("ok" in res) {
            }
            else {
            }
        }
        else {
            const newUserClicked = {
                'userId': [parsedData.ok.id],
                'jobId': [jobId],
            };
            const res = await userclicked.incrementCounter(newUserClicked);
            if ("ok" in res) {
            }
            else {
            }
        }
    }
    return ["Ok"];
};
export const getUserClickedByUserId = async () => {
    try {
        const userData = localStorage.getItem("current_user");
        if (userData) {
            const parsedData = JSON.parse(userData);
            const result = await userclicked.getAllUserClickedByUserId(parsedData.ok.id);
            return result;
        }
        else {
            return [];
        }
    }
    catch (error) {
        return [];
    }
};
