export default function JobCard({ job }: { job: Job }) {



    return (
        <div>

            <div>
                <p>JOb Title</p>
                <p>Job Type</p>
            </div>

            <div>
                <p>Work Hours</p>
                <p>Salary</p>
            </div>

            <div>
                <p>Description</p>
            </div>

            <div>
                <button>View Details</button>
            </div>
        </div>

    );
}