
export const addIncrementUserClicked = async (jobId: string) :Promise<string[]> => {

    const userData = localStorage.getItem("current_user");

    if(userData){
        const parsedData = JSON.parse(userData);
        console.log("User ID:", parsedData.ok.id);


    }
    return ["Ok"]
}