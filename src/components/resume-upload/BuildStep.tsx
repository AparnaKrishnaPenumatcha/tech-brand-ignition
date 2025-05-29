
import React from 'react';
import BuildProfile from './BuildProfile';

interface BuildStepProps {
  finalResumeData: any;
  onBack: () => void;
}

const BuildStep: React.FC<BuildStepProps> = ({
  finalResumeData,
  onBack
}) => {
  return (
    <div className="w-full max-w-none">
      <BuildProfile 
        resumeData={finalResumeData}
        onBack={onBack}
      />
    </div>
  );
};

export default BuildStep;
