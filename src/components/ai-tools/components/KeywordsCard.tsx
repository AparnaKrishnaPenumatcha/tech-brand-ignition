
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Hash, TrendingUp } from 'lucide-react';

interface KeywordsCardProps {
  keywords: string[];
}

const KeywordsCard: React.FC<KeywordsCardProps> = ({ keywords }) => {
  console.log('🔑 KeywordsCard rendering with keywords:', keywords);
  
  if (!keywords || keywords.length === 0) {
    console.log('⚠️ No keywords to display, hiding KeywordsCard');
    return null;
  }

  return (
    <Card className="border-l-4 border-l-blue-400 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-blue-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Strategic Keywords to Add</h3>
              <p className="text-sm text-blue-600 font-normal">
                Include these keywords to improve ATS compatibility and relevance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
            <Hash className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {keywords.length} Keywords
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {keywords.map((keyword, index) => (
            <div 
              key={index}
              className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
              <span className="font-medium flex-1">{keyword}</span>
              <TrendingUp className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Pro Tip:</strong> Integrate these keywords naturally throughout your resume, 
            especially in your summary, skills section, and job descriptions to improve your chances with 
            Applicant Tracking Systems (ATS).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordsCard;
