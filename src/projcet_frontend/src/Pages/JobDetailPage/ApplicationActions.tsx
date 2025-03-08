import { useEffect, useState } from "react";
import { useBoolean } from "../../components/context/Context";
import { ApplyButton } from "./ApplyButton";
import { TermsCheckbox } from "./TermsCheckBox";

export const ApplicantActions = ({
  salary,
  termsAccepted,
  responsibilityAccepted,
  isApplicationClosed,
  remainingPositions,
  // applied,
  onApply,
  onTermsChange,
  onResponsibilityChange,
  jobStatus,
}: {
  salary: string;
  termsAccepted: boolean;
  responsibilityAccepted: boolean;
  isApplicationClosed: boolean;
  remainingPositions: string;
  // applied: boolean;
  onApply: () => void;
  onTermsChange: (checked: boolean) => void;
  onResponsibilityChange: (checked: boolean) => void;
  jobStatus: string
}
  


) => {

  const { isActive } = useBoolean();
  const [applied, setApplied] = useState(false);
  useEffect(() => {
    setApplied(isActive);
  }
  , [isActive]);


  return (
  

  <div className="space-y-6">
    <div className="bg-blue-50/30 p-4 rounded-xl">
      <h3 className="text-3xl font-semibold text-indigo-800 mb-2">Job Reward</h3>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-green-600">${salary}/person</span>
      </div>
    </div>

    <div className="space-y-4">
      <TermsCheckbox
        id="terms"
        checked={termsAccepted}
        onChange={(e) => onTermsChange(e.target.checked)}
        label="I have fully understood and meet all job requirements"
      />
      <TermsCheckbox
        id="responsibility"
        checked={responsibilityAccepted}
        onChange={(e) => onResponsibilityChange(e.target.checked)}
        label="I apply to this job voluntarily and take full responsibility"
      />
    </div>

    {isApplicationClosed ? (
      <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm">
        ❌ This job has reached the maximum number of applicants
      </div>
    ) : (
      <div className="bg-green-50 p-4 rounded-xl text-green-600 text-sm">
        ✅ {remainingPositions} positions remaining
      </div>
    )}

    {/* Disable ApplyButton if job is finished */}
    {jobStatus === "Finished" ? (
      <ApplyButton
        applied={true} // Set to true to show "Applied" state
        disabled={true} // Disable the button
        onClick={onApply}
        label="Job Finished" // Custom label for finished jobs
      />
    ) : (
      <ApplyButton
        applied={applied}
        disabled={applied  || !termsAccepted || !responsibilityAccepted || isApplicationClosed}
        onClick={onApply}
      />
    )}

    <p className="text-xs text-gray-500 text-center">
      By applying, you agree to our terms of service and privacy policy
    </p>
  </div>
  )


};