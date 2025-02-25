import Navbar from "../../components/Navbar";

export default function FindJobPage(){

    return(
        <div className="flex flex-col h-screen ">
            {/* Navbar - Stays on top, does not scroll */}
            <div className="flex-none w-full bg-white shadow-md z-50">
                <Navbar />
            </div>

            {/* Main Content - This is the only scrollable section */}
            <div className="flex-grow overflow-x-hidden scrollbar-hide">

                {/* Filter Section                */}
               <div className="flex flex-col bg-brown w-[30vw] h-screen container ">

                    <div className="flex flex-col h-screen p-20 ">
                        {/* Work Hours Filter Section */}
                        <p className="text-3xl font-light mb-5">Work Hours</p>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"< 20"}/>
                            <label className="font-extralight text-xl">&lt; 20 Hours</label> 
                        </div>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"20 - 40"}/>
                            <label className="font-extralight text-xl">20 - 40 Hours</label> 
                        </div>
                        <div className="flex gap-5 mb-7">
                            <input type="checkbox" className="scale-150" value={"> 40"}/>
                            <label className="font-extralight text-xl">&gt; 40 Hours</label> 
                        </div>

                        {/* Job Type Filter Section */}
                        <p className="text-3xl font-light mb-5">Job Tag</p>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"< 20"} />
                            <label className="font-extralight text-xl">Web Development</label>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"20 - 40"} />
                            <label className="font-extralight text-xl">Mobile Development</label>
                        </div>
                        <div className="flex gap-5 mb-7">
                            <input type="checkbox" className="scale-150" value={"> 40"} />
                            <label className="font-extralight text-xl">AI For Computer Vision</label>
                        </div>

                        {/* Job Salary Filter Section */}
                        <p className="text-3xl font-light mb-5">Job Salary</p>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"< 20"} />
                            <label className="font-extralight text-xl">&lt; 100$</label>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"20 - 40"} />
                            <label className="font-extralight text-xl">100$ - 300$</label>
                        </div>
                        <div className="flex gap-5 mb-7">
                            <input type="checkbox" className="scale-150" value={"> 40"} />
                            <label className="font-extralight text-xl">&gt; 300$</label>
                        </div>

                    
                        
                    </div>

               </div>






                {/* List Job Section */}
               <div>

                    {/* Recommendation Job Section */}
                    <div>

                    </div>
                    
                    {/* List All Job Section */}
                    <div>

                    </div>

               </div>
            </div>
        </div>
    );
}