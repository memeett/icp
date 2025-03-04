import { userclicked } from "../../../declarations/userclicked";
import { UserClicked, UserClickedPayload } from "../../../declarations/userclicked/userclicked.did";

export const addIncrementUserClicked = async (jobId: string) :Promise<string[]> => {
    const userData = localStorage.getItem("current_user");
    
    if(userData){
        const parsedData = JSON.parse(userData);
        console.log("User ID:", parsedData.ok.id);

        const resUserClicked = await userclicked.getUserClickedByUserIdJobId(parsedData.ok.id, jobId)
        console.log(resUserClicked)
        if(resUserClicked.length == 0){
            const res = await userclicked.createUserClicked(parsedData.ok.id, jobId)
            if("ok" in res){
                console.log(res.ok)
            }else{
                console.log("n")
            }
        }else{
            const newUserClicked: UserClickedPayload = {
                'userId': [parsedData.ok.id], 
                'jobId': [jobId], 
            };
            const res = await userclicked.incrementCounter(newUserClicked)
            if("ok" in res){
                console.log(res.ok)
            }else{
                console.log(res.err)
            }
        }


    }
    return ["Ok"]
}

export const getUserClickedByUserId = async () : Promise<UserClicked[] | []> => {
    try {
        const userData = localStorage.getItem("current_user");
        if(userData){
            
            const parsedData = JSON.parse(userData);
            const result = await userclicked.getAllUserClickedByUserId(parsedData.ok.id)
            return result;
        }else{
            console.error("Failed to get all jobs!!");
            return [];
        }
    } catch (error) {
        console.error("Failed to get all jobs:", error);
        return [];
    }
}