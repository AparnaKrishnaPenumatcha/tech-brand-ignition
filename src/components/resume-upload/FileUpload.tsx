
import React from 'react';
import { Input } from '@/components/ui/input';

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, setFile, onFileChange }) => {
  return (
    <div className="border-2 border-dashed border-navy-200 rounded-lg p-6 text-center">
      {file ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center text-electric-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="font-medium text-navy-700">{file.name}</p>
          <p className="text-sm text-navy-500">{(file.size / 1024).toFixed(2)} KB</p>
          <button 
            onClick={() => setFile(null)}
            className="text-sm text-electric-500 hover:text-electric-600"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-center text-navy-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="text-navy-600">Drag and drop your resume PDF or DOCX</p>
          <p className="text-sm text-navy-500">or click to browse files</p>
        </div>
      )}
      
      <Input
        type="file"
        accept=".pdf,.docx"
        onChange={onFileChange}
        className={file ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
      />
    </div>
  );
};

export default FileUpload;
