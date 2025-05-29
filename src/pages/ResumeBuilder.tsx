
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ResumeUploader from '@/components/resume-upload/ResumeUploader';

const ResumeBuilder: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-custom flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-navy-900">
            Portfolio<span className="text-electric-500">.</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-4">
              Build Your Resume
            </h1>
            <p className="text-navy-600 text-lg">
              Create a professional resume by uploading your existing one or entering your information manually
            </p>
          </div>
          
          <ResumeUploader />
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
