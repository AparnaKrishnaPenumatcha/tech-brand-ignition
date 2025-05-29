
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Exceptional leadership skills and technical expertise. Always goes above and beyond to deliver innovative solutions.",
      name: "Dr. Sarah Johnson",
      role: "Professor of Computer Science"
    },
    {
      quote: "A natural leader with the vision to drive meaningful change in technology. Impressive problem-solving abilities.",
      name: "Michael Chen",
      role: "Senior Software Engineer"
    },
    {
      quote: "Outstanding collaboration and communication skills. Brings fresh perspectives to every project.",
      name: "Emily Rodriguez",
      role: "Tech Lead, Innovation Lab"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-electric-500 mb-2">Testimonials</h2>
          <h3 className="text-3xl font-bold text-navy-900">What Others Say</h3>
          <p className="text-navy-600 mt-4 max-w-2xl mx-auto">
            Feedback from mentors, colleagues, and collaborators who have witnessed my work firsthand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-navy-50 border-none hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <blockquote className="text-navy-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-navy-200 pt-4">
                  <p className="font-semibold text-navy-900">{testimonial.name}</p>
                  <p className="text-sm text-navy-600">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
