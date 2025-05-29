
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar } from 'lucide-react';
import { ResumeData } from '@/utils/resumeProcessing';

interface CertificatesSectionProps {
  resumeData?: ResumeData | null;
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ resumeData }) => {
  // Default certificates if none available
  const defaultCertificates = [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      year: "2023"
    },
    {
      name: "Professional Scrum Master",
      issuer: "Scrum.org",
      year: "2022"
    },
    {
      name: "Google Cloud Professional",
      issuer: "Google Cloud",
      year: "2023"
    }
  ];

  // Use resume data if available, otherwise use defaults
  const certificates = resumeData?.certifications?.length ? 
    resumeData.certifications.filter(cert => cert.name !== 'Ignore' && cert.issuer !== 'Ignore') : 
    defaultCertificates;

  if (!certificates.length) return null;

  return (
    <section id="certificates" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-electric-500 mb-2">Certifications</h2>
          <h3 className="text-3xl font-bold text-navy-900">Professional Credentials</h3>
          <p className="text-navy-600 mt-4 max-w-2xl mx-auto">
            Continuously expanding knowledge through industry-recognized certifications and training programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow border-l-4 border-l-electric-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-electric-100 rounded-lg">
                    <Award className="w-5 h-5 text-electric-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{cert.name}</CardTitle>
                    <p className="text-navy-600 font-medium mt-1">{cert.issuer}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-navy-500">
                  <Calendar className="w-4 h-4" />
                  <span>{cert.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
