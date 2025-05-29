
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { renderMarkdownText } from '../utils/textUtils';

interface StrengthsCardProps {
  strengths: string[];
}

const StrengthsCard: React.FC<StrengthsCardProps> = ({ strengths }) => {
  if (!strengths || strengths.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-green-400">
      <CardHeader>
        <CardTitle className="text-green-700 flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          Your Resume Strengths
        </CardTitle>
        <p className="text-sm text-green-600 mt-1">
          These elements are working well in your resume
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800 leading-relaxed">
                {renderMarkdownText(strength)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrengthsCard;
