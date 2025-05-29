import React from 'react';
import { renderMarkdownText } from '../utils/markdownUtils';

interface Improvement {
  area: string;
  suggestion: string;
  impact: string;
}

interface Feedback {
  overallScore: number;
  strengths: string[];
  improvements: Improvement[];
  keywordsToAdd: string[];
  summary: string;
}

interface ResumeFeedbackProps {
  feedback: Feedback;
}

const ResumeFeedback: React.FC<ResumeFeedbackProps> = ({ feedback }) => {
  const { overallScore, strengths, improvements, keywordsToAdd, summary } = feedback;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Resume Feedback</h2>

      {/* Overall Score */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Overall Score</h3>
        <p className="text-4xl font-extrabold text-indigo-600">{overallScore}/100</p>
      </div>

      {/* Strengths Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Strengths</h3>
        {strengths.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {strengths.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No strengths identified.</p>
        )}
      </div>

      {/* Improvements Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Areas for Improvement</h3>
        <div className="space-y-4">
          {improvements.map((imp, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-200 rounded-xl hover:shadow transition-shadow"
            >
              <h4 className="text-lg font-semibold text-gray-800">{imp.area}</h4>
              <div className="text-gray-700 leading-relaxed mt-1">
                {renderMarkdownText(imp.suggestion)}
              </div>
              <p className="text-sm text-gray-500 mt-2 italic">Impact: {imp.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords to Add */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Keywords to Add</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {keywordsToAdd.map((keyword, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700">Summary</h3>
        <div className="text-gray-700 mt-1 leading-relaxed">
          {renderMarkdownText(summary)}
        </div>
      </div>
    </div>
  );
};

export default ResumeFeedback;
