
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Lightbulb, Target } from 'lucide-react';
import { parseImprovements, renderMarkdownText } from '../utils/textUtils';
import { Improvement } from '../types/resumeAnalysis';

interface ImprovementsCardProps {
  improvements: Improvement[] | any;
}

const ImprovementsCard: React.FC<ImprovementsCardProps> = ({ improvements }) => {
  const parsedImprovements = parseImprovements(improvements);

  return (
    <Card className="border-l-4 border-l-orange-400">
      <CardHeader>
        <CardTitle className="text-orange-700 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Priority Improvements
        </CardTitle>
        <p className="text-sm text-orange-600 mt-1">
          Focus on these areas to significantly enhance your resume's impact
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {parsedImprovements.map((improvement, index) => (
            <div key={index} className="bg-white rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              {/* Area Header */}
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-orange-800">
                    {improvement.area || `Area ${index + 1}`}
                  </h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Suggestion */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-gray-800">Recommendation</h4>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-700 leading-relaxed">
                      {renderMarkdownText(improvement.suggestion || improvement)}
                    </p>
                  </div>
                </div>
                
                {/* Impact */}
                {improvement.impact && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-gray-800">Expected Impact</h4>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-gray-700 leading-relaxed">
                        {renderMarkdownText(improvement.impact)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementsCard;
