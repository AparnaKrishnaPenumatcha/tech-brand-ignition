
import { CheckCircle, AlertCircle } from 'lucide-react';

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreIcon = (score: number) => {
  if (score >= 80) return CheckCircle;
  return AlertCircle;
};

export const getScoreBadgeColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 border-green-200';
  if (score >= 60) return 'bg-yellow-100 border-yellow-200';
  return 'bg-red-100 border-red-200';
};
