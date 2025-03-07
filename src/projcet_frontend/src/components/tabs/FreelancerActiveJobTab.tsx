import { useEffect, useState } from "react";
import { JobTransaction } from "../../../../declarations/job_transaction/job_transaction.did";

export default function FreelancerActiveJobTab() {
    const [activeJob, setActiveJob] = useState<JobTransaction[]>()

    useEffect(() => {

    }, [])

    return (
        <div>

        </div>
    );
}