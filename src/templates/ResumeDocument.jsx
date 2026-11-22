import React from 'react';
import ClassicTemplate from './ClassicTemplate.jsx';
import ModernTemplate from './ModernTemplate.jsx';
import ProfessionalTemplate from './ProfessionalTemplate.jsx';
import MinimalTemplate from './MinimalTemplate.jsx';
import TechnicalTemplate from './TechnicalTemplate.jsx';
import AcademicTemplate from './AcademicTemplate.jsx';

const ResumeDocument = ({ data, template = 'classic', accentColor = '#111827', className = '' }) => {
  const renderTemplate = () => {
    switch (template?.toLowerCase()) {
      case 'modern':
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case 'professional':
        return <ProfessionalTemplate data={data} accentColor={accentColor} />;
      case 'minimal':
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case 'technical':
        return <TechnicalTemplate data={data} accentColor={accentColor} />;
      case 'academic':
        return <AcademicTemplate data={data} accentColor={accentColor} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className={`resume-document ${className}`}>
      {renderTemplate()}
    </div>
  );
};

export default ResumeDocument;
