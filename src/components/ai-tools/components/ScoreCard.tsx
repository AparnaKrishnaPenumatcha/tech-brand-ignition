import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getScoreColor, getScoreIcon, getScoreBadgeColor } from '../utils/scoreUtils';
import { renderMarkdownText } from '../utils/markdownUtils';

interface ScoreCardProps {
  score: number;
  summary: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, summary }) => {
  console.log('🎯 ScoreCard rendering with:', { score, summaryLength: summary?.length });
  
  const ScoreIcon = getScoreIcon(score);
  
  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', icon: TrendingUp };
    if (score >= 60) return { label: 'Good', icon: Minus };
    if (score >= 40) return { label: 'Needs Work', icon: TrendingDown };
    return { label: 'Critical', icon: TrendingDown };
  };

  const scoreInfo = getScoreLabel(score);
  const ScoreTrendIcon = scoreInfo.icon;

  return (
    <Card className={`border-2 ${getScoreBadgeColor(score)} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Resume Score Analysis</h3>
              <p className="text-sm text-gray-600 font-normal">Overall assessment of your resume</p>
            </div>
          </span>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl ${getScoreBadgeColor(score)} border-2`}>
            <div className="text-center">
              <div className={`flex items-center gap-2 justify-center mb-1`}>
                <ScoreIcon className="w-6 h-6" />
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-xl text-gray-500">/100</span>
              </div>
              <div className="flex items-center gap-1 justify-center">
                <ScoreTrendIcon className={`w-4 h-4 ${getScoreColor(score)}`} />
                <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                  {scoreInfo.label}
                </span>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Summary & Key Insights
          </h4>
          <div className="text-gray-700 leading-relaxed">
            {renderMarkdownText(summary)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
