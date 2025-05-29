
import React from 'react';
import { Card } from '@/components/ui/card';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <Card className="bg-gray-100 p-3 mr-12">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingIndicator;
