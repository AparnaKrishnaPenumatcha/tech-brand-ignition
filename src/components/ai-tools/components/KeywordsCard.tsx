
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface KeywordsCardProps {
  keywords: string[];
}

const KeywordsCard: React.FC<KeywordsCardProps> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-blue-400">
      <CardHeader>
        <CardTitle className="text-blue-700 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Strategic Keywords to Add
        </CardTitle>
        <p className="text-sm text-blue-600 mt-1">
          Include these keywords to improve ATS compatibility and relevance
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {keywords.map((keyword, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{keyword}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordsCard;
