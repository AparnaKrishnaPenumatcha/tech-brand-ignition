
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Lightbulb, Target, AlertTriangle } from 'lucide-react';
import { parseImprovements, renderMarkdownText } from '../utils/textUtils';
import { Improvement } from '../types/resumeAnalysis';

interface ImprovementsCardProps {
  improvements: Improvement[] | any;
}

const ImprovementsCard: React.FC<ImprovementsCardProps> = ({ improvements }) => {
  console.log('🔧 ImprovementsCard raw input:', improvements);
  
  const parsedImprovements = parseImprovements(improvements);
  console.log('📝 ImprovementsCard final parsed data:', parsedImprovements);

  if (!parsedImprovements || parsedImprovements.length === 0) {
    console.log('⚠️ No improvements to display');
    return null;
  }

  const getPriorityColor = (index: number) => {
    if (index === 0) return 'bg-red-500';
    if (index === 1) return 'bg-orange-500';
    if (index === 2) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getPriorityLabel = (index: number) => {
    if (index === 0) return 'Critical';
    if (index === 1) return 'High';
    if (index === 2) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="border-l-4 border-l-orange-400 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardTitle className="text-orange-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Priority Improvements</h3>
              <p className="text-sm text-orange-600 font-normal">
                Focus on these areas to significantly enhance your resume's impact
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              {parsedImprovements.length} Areas to Improve
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {parsedImprovements.map((improvement, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* Priority Header */}
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${getPriorityColor(index)} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {improvement.area || `Improvement ${index + 1}`}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          index === 0 ? 'bg-red-100 text-red-700' :
                          index === 1 ? 'bg-orange-100 text-orange-700' :
                          index === 2 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {getPriorityLabel(index)} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Suggestion */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 bg-blue-100 rounded">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Recommendation</h4>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="text-gray-700 leading-relaxed">
                      {renderMarkdownText(improvement.suggestion || 'No specific suggestion provided')}
                    </div>
                  </div>
                </div>
                
                {/* Impact */}
                {improvement.impact && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 bg-green-100 rounded">
                        <Target className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">Expected Impact</h4>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <div className="text-gray-700 leading-relaxed">
                        {renderMarkdownText(improvement.impact)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Action Guidance */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-orange-100 rounded">
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">Next Steps</h4>
              <p className="text-sm text-orange-700 leading-relaxed">
                Address these improvements in priority order. Start with critical items first, 
                as they will have the most significant impact on your resume's effectiveness.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementsCard;
