import React, { createContext, useContext } from 'react';
import { useResumeStore, TEMPLATES, ACCENT_COLORS } from '../store/useResumeStore.js';

export { TEMPLATES, ACCENT_COLORS };

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const store = useResumeStore();

  const value = {
    // Resume data and structure
    resumeData: store.resume,
    resume: store.resume,
    activeTemplate: store.activeTemplate,
    accentColor: store.accentColor,
    
    // Autosave & Hydration Status
    isSaving: store.isSaving,
    saveStatus: store.saveStatus,
    lastSaved: store.lastSaved,
    hasHydrated: store.hasHydrated,

    // Cloud Synchronization Status (Phase 9)
    activeCloudResumeId: store.activeCloudResumeId,
    cloudResumeTitle: store.cloudResumeTitle,
    cloudResumes: store.cloudResumes,
    cloudSyncStatus: store.cloudSyncStatus,
    lastCloudSynced: store.lastCloudSynced,
    setActiveCloudResume: store.setActiveCloudResume,
    setLocalDraftMode: store.setLocalDraftMode,
    setCloudSyncStatus: store.setCloudSyncStatus,
    setCloudResumes: store.setCloudResumes,
    setCloudResumeTitle: store.setCloudResumeTitle,
    setLastCloudSynced: store.setLastCloudSynced,

    // Store Actions
    setActiveTemplate: store.setActiveTemplate,
    setTemplate: store.setTemplate,
    setAccentColor: store.setAccentColor,
    
    // Basic Information Actions
    updateBasics: store.updateBasics,
    updatePersonalInfo: store.updatePersonalInfo,
    
    // Summary Actions
    updateSummary: store.updateSummary,
    updateProfessionalSummary: store.updateProfessionalSummary,
    
    // Work Experience Actions
    addExperience: store.addExperience,
    updateExperience: store.updateExperience,
    removeExperience: store.removeExperience,
    reorderExperience: store.reorderExperience,
    updateWorkExperience: store.updateWorkExperience,
    
    // Education Actions
    addEducation: store.addEducation,
    updateEducation: store.updateEducation,
    updateEducationList: store.updateEducationList,
    removeEducation: store.removeEducation,
    reorderEducation: store.reorderEducation,
    
    // Skills Actions
    addSkillGroup: store.addSkillGroup,
    updateSkillGroup: store.updateSkillGroup,
    removeSkillGroup: store.removeSkillGroup,
    reorderSkillGroup: store.reorderSkillGroup,
    reorderSkills: store.reorderSkills,
    addSkillToGroup: store.addSkillToGroup,
    removeSkillFromGroup: store.removeSkillFromGroup,
    updateSkills: store.updateSkills,
    
    // Projects Actions
    addProject: store.addProject,
    updateProject: store.updateProject,
    removeProject: store.removeProject,
    reorderProjects: store.reorderProjects,
    updateProjects: store.updateProjects,
    
    // Certifications Actions
    addCertification: store.addCertification,
    updateCertification: store.updateCertification,
    removeCertification: store.removeCertification,
    reorderCertifications: store.reorderCertifications,
    updateCertifications: store.updateCertifications,
    
    // Lifecycle Actions
    resetResume: store.resetResume,
    resetToSample: store.resetToSample,
    clearAll: store.clearAll,
    clearSavedResume: store.clearSavedResume,
    loadResume: store.loadResume,
    
    // UI Helpers
    calculateCompletion: store.calculateCompletion,
    getPlainTextForATS: store.getPlainTextForATS,
    downloadJson: store.downloadJson,
    printResume: store.printResume,
    downloadPdf: store.downloadPdf,
    downloadDocx: store.downloadDocx,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    // If used outside provider, fallback directly to useResumeStore hook
    return useResumeStore();
  }
  return context;
};

export default ResumeContext;
