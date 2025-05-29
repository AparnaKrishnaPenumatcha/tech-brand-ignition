
import React from 'react';
import HybridDataForm from './HybridDataForm';

interface HybridStepProps {
  finalResumeData: any;
  onComplete: (data: any) => void;
  onBackToSelector: () => void;
}

const HybridStep: React.FC<HybridStepProps> = ({
  finalResumeData,
  onComplete,
  onBackToSelector
}) => {
  return (
    <div className="w-full max-w-none">
      <HybridDataForm 
        parsedData={finalResumeData}
        onComplete={onComplete}
      />
      <div className="text-center mt-4">
        <button 
          onClick={onBackToSelector}
          className="text-sm text-navy-500 hover:text-navy-700 underline"
        >
          ← Start over
        </button>
      </div>
    </div>
  );
};

export default HybridStep;
