
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Award } from 'lucide-react';
import { renderMarkdownText } from '../utils/textUtils';

interface StrengthsCardProps {
  strengths: string[];
}

const StrengthsCard: React.FC<StrengthsCardProps> = ({ strengths }) => {
  console.log('💪 StrengthsCard rendering with strengths:', strengths);
  
  if (!strengths || strengths.length === 0) {
    console.log('⚠️ No strengths to display, hiding StrengthsCard');
    return null;
  }

  return (
    <Card className="border-l-4 border-l-green-400 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="text-green-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Resume Strengths</h3>
              <p className="text-sm text-green-600 font-normal">
                These elements are working well in your resume
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {strengths.length} Strengths
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 hover:shadow-md group">
              <div className="flex items-center gap-2 mt-0.5">
                <Star className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 text-sm text-green-800 leading-relaxed">
                {renderMarkdownText(strength)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <strong>Great job!</strong> Keep these strengths prominent in your resume as they 
            demonstrate your value to potential employers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrengthsCard;
