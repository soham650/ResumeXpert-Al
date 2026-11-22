import React from 'react';
import { pdf } from '@react-pdf/renderer';
import ClassicPdfDocument from '../templates/pdf/ClassicPdfDocument.js';

/**
 * Sanitizes candidate name into a professional, filesystem-safe PDF filename.
 * Example: "John Doe" -> "John_Doe_Resume.pdf"
 */
export const getSafeResumeFilename = (resumeData, extension = 'pdf') => {
  const rawName = 
    (typeof resumeData === 'string' ? resumeData : null) ||
    resumeData?.basics?.fullName || 
    resumeData?.personalInfo?.fullName || 
    '';

  const cleanName = rawName
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .replace(/\s+/g, '_');

  const ext = extension.replace(/^\./, '');

  if (!cleanName) {
    return `Resume.${ext}`;
  }

  return `${cleanName}_Resume.${ext}`;
};

/**
 * Generates an ATS-compliant PDF using @react-pdf/renderer and triggers a client download.
 */
export const downloadResumePdf = async (resumeData, activeTemplate = 'classic', accentColor = '#111827') => {
  try {
    const filename = getSafeResumeFilename(resumeData);

    // Create the document element
    const docElement = React.createElement(ClassicPdfDocument, {
      data: resumeData,
      accentColor,
    });

    // Generate native vector PDF blob with selectable text
    const instance = pdf(docElement);
    const blob = await instance.toBlob();

    if (!blob) {
      throw new Error('Failed to generate PDF blob from resume data');
    }

    // Trigger browser download via object URL
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Clean up DOM and memory
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 3000);
    }

    return {
      success: true,
      filename,
      size: blob.size,
    };
  } catch (error) {
    console.error('[pdfDownload] Failed to generate and download resume PDF:', error);
    throw new Error(error.message || 'An error occurred during PDF generation');
  }
};
