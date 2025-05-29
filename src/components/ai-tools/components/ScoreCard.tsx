
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { getScoreColor, getScoreIcon, getScoreBadgeColor } from '../utils/scoreUtils';
import { renderMarkdownText } from '../utils/textUtils';

interface ScoreCardProps {
  score: number;
  summary: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, summary }) => {
  const ScoreIcon = getScoreIcon(score);

  return (
    <Card className={`border-2 ${getScoreBadgeColor(score)}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            Resume Score Analysis
          </span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getScoreBadgeColor(score)} border`}>
            <ScoreIcon className="w-5 h-5" />
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}/100
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
          {renderMarkdownText(summary)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
