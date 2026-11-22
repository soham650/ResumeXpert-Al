import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { sampleResumeData } from '../data/sampleData.js';
import { resumeSchema } from '../schema/resume.js';
import { downloadResumePdf } from '../utils/pdfDownload.js';
import { downloadResumeDocx } from '../utils/docxExport.js';

export const STORAGE_KEY = 'resumecraft-resume-storage';
export const STORE_VERSION = 1;

export const TEMPLATES = {
  classic: { 
    id: 'classic', 
    name: 'Classic ATS', 
    description: 'Traditional serif, Ivy League standard with clean horizontal dividers',
    tag: 'ATS Standard',
    badgeColor: '#10B981'
  },
  modern: { 
    id: 'modern', 
    name: 'Modern Clean', 
    description: 'Contemporary sans-serif, bold headers with subtle accent styling',
    tag: 'Most Popular',
    badgeColor: '#6335F5'
  },
  professional: { 
    id: 'professional', 
    name: 'Professional Executive', 
    description: 'Corporate executive-style layout with structured summary and impact metrics',
    tag: 'Executive',
    badgeColor: '#1E3A8A'
  },
  minimal: { 
    id: 'minimal', 
    name: 'Minimalist', 
    description: 'Clean, understated elegance with generous whitespace and compact lines',
    tag: 'Minimal',
    badgeColor: '#475569'
  },
  technical: { 
    id: 'technical', 
    name: 'Technical Specialist', 
    description: 'Optimized for software engineers, tech leads, and DevOps with prominent skills',
    tag: 'Tech-Focused',
    badgeColor: '#0F766E'
  },
  academic: { 
    id: 'academic', 
    name: 'Academic & Research', 
    description: 'Education, research, publications and curriculum vitae focused layout',
    tag: 'Academic',
    badgeColor: '#701A75'
  },
};

export const ACCENT_COLORS = [
  { id: 'classic-black', name: 'Classic Black', hex: '#111827' },
  { id: 'navy', name: 'Navy Blue', hex: '#1e3a8a' },
  { id: 'emerald', name: 'Emerald', hex: '#065f46' },
  { id: 'violet', name: 'Purple / Violet', hex: '#6335F5' },
  { id: 'slate', name: 'Slate Gray', hex: '#475569' },
];

/**
 * Creates a clean default resume matching the schema, with optional seed data.
 */
export const createDefaultResume = (seedData = sampleResumeData) => {
  const basics = {
    fullName: seedData?.basics?.fullName || seedData?.personalInfo?.fullName || '',
    professionalTitle: seedData?.basics?.professionalTitle || seedData?.personalInfo?.professionalTitle || '',
    email: seedData?.basics?.email || seedData?.personalInfo?.email || '',
    phone: seedData?.basics?.phone || seedData?.personalInfo?.phone || '',
    location: seedData?.basics?.location || seedData?.personalInfo?.location || '',
    linkedinUrl: seedData?.basics?.linkedinUrl || seedData?.personalInfo?.linkedinUrl || '',
    githubUrl: seedData?.basics?.githubUrl || seedData?.personalInfo?.githubUrl || '',
    portfolioUrl: seedData?.basics?.portfolioUrl || seedData?.personalInfo?.portfolioUrl || '',
    additionalLinks: seedData?.basics?.additionalLinks 
      ? [...seedData.basics.additionalLinks] 
      : (seedData?.personalInfo?.additionalLinks ? [...seedData.personalInfo.additionalLinks] : []),
  };

  const summary = seedData?.summary || seedData?.professionalSummary || '';
  const rawExperience = seedData?.experience || seedData?.workExperience || [];
  const experience = rawExperience.map((exp, index) => ({
    id: exp.id || index + 1,
    companyName: exp.companyName || '',
    jobTitle: exp.jobTitle || '',
    location: exp.location || '',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    achievements: exp.achievements ? [...exp.achievements] : [''],
  }));

  const education = (seedData?.education || []).map((edu, index) => ({
    id: edu.id || index + 1,
    institutionName: edu.institutionName || '',
    degree: edu.degree || '',
    startYear: edu.startYear || '',
    endYear: edu.endYear || '',
    score: edu.score || '',
  }));

  const skills = (seedData?.skills || []).map((grp, index) => ({
    id: grp.id || index + 1,
    groupName: grp.groupName || '',
    skills: grp.skills ? [...grp.skills] : [],
  }));

  const projects = (seedData?.projects || []).map((prj, index) => ({
    id: prj.id || index + 1,
    projectName: prj.projectName || '',
    technologies: prj.technologies || '',
    projectLink: prj.projectLink || '',
    achievements: prj.achievements ? [...prj.achievements] : [''],
  }));

  const certifications = (seedData?.certifications || []).map((c) => {
    if (typeof c === 'string') return c;
    if (c && typeof c === 'object') {
      return c.certificateName || c.name || c.title || (c.issuer ? `${c.name || 'Certificate'} - ${c.issuer}` : 'Certified Professional');
    }
    return String(c || '');
  }).filter(Boolean);

  return {
    basics,
    personalInfo: basics, // Alias for template backward-compatibility
    summary,
    professionalSummary: summary, // Alias for template backward-compatibility
    experience,
    workExperience: experience, // Alias for template backward-compatibility
    education,
    skills,
    projects,
    certifications,
    meta: {
      template: 'classic',
      accentColor: '#111827',
      lastSaved: new Date().toISOString(),
      version: STORE_VERSION,
    },
  };
};

/**
 * Creates a completely blank resume conforming to resumeSchema.
 */
export const createEmptyResume = () => createDefaultResume(resumeSchema);

/**
 * Safe LocalStorage wrapper with error handling and quota safety.
 */
export const safeLocalStorage = {
  getItem: (name) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(name);
    } catch (error) {
      console.warn(`[useResumeStore] LocalStorage read failed for "${name}":`, error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(name, value);
    } catch (error) {
      console.warn(`[useResumeStore] LocalStorage write failed for "${name}":`, error);
    }
  },
  removeItem: (name) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(name);
    } catch (error) {
      console.warn(`[useResumeStore] LocalStorage remove failed for "${name}":`, error);
    }
  },
};

/**
 * Primary Zustand Store for ResumeCraft
 */
export const useResumeStore = create(
  persist(
    (set, get) => ({
      // Store state
      resume: createDefaultResume(sampleResumeData),
      activeTemplate: 'classic',
      accentColor: '#111827',
      isSaving: false,
      saveStatus: 'saved', // 'idle' | 'saving' | 'saved' | 'error'
      lastSaved: new Date().toISOString(),
      hasHydrated: false,

      // Cloud Synchronization State (Phase 9)
      activeCloudResumeId: null, // string | null
      cloudResumeTitle: 'My Resume',
      cloudResumes: [],
      cloudSyncStatus: 'local', // 'local' | 'synced' | 'saving' | 'offline' | 'error'
      lastCloudSynced: null,

      // Hydration state handler
      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Cloud state handlers (Phase 9)
      setActiveCloudResume: (cloudResumeRecord) => {
        if (!cloudResumeRecord) return;
        const normalized = createDefaultResume(cloudResumeRecord.resumeData || {});
        set({
          resume: normalized,
          activeCloudResumeId: cloudResumeRecord.id,
          cloudResumeTitle: cloudResumeRecord.title || 'Untitled Resume',
          activeTemplate: cloudResumeRecord.template || 'classic',
          cloudSyncStatus: 'synced',
          lastCloudSynced: cloudResumeRecord.updatedAt || new Date().toISOString(),
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        });
      },

      setLocalDraftMode: () => {
        set({
          activeCloudResumeId: null,
          cloudResumeTitle: 'Local Draft Resume',
          cloudSyncStatus: 'local',
        });
      },

      setCloudSyncStatus: (status) => set({ cloudSyncStatus: status }),
      setCloudResumes: (list) => set({ cloudResumes: Array.isArray(list) ? list : [] }),
      setCloudResumeTitle: (title) => set({ cloudResumeTitle: title || 'Untitled Resume' }),
      setLastCloudSynced: (timestamp) => set({ lastCloudSynced: timestamp }),

      // -------------------------------------------------------------
      // Basic Information Actions
      // -------------------------------------------------------------
      updateBasics: (data) => {
        set((state) => {
          const updatedBasics = { ...state.resume.basics, ...data };
          return {
            resume: {
              ...state.resume,
              basics: updatedBasics,
              personalInfo: updatedBasics, // sync alias
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updatePersonalInfo: (field, value) => {
        get().updateBasics({ [field]: value });
      },

      // -------------------------------------------------------------
      // Summary Actions
      // -------------------------------------------------------------
      updateSummary: (summary) => {
        set((state) => ({
          resume: {
            ...state.resume,
            summary: typeof summary === 'string' ? summary : '',
            professionalSummary: typeof summary === 'string' ? summary : '', // sync alias
            meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      updateProfessionalSummary: (summary) => {
        get().updateSummary(summary);
      },

      // -------------------------------------------------------------
      // Work Experience Actions
      // -------------------------------------------------------------
      addExperience: (entry = {}) => {
        set((state) => {
          const currentList = state.resume.experience || [];
          const maxId = currentList.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
          const newId = maxId + 1;

          const newEntry = {
            id: newId,
            companyName: entry.companyName || '',
            jobTitle: entry.jobTitle || '',
            location: entry.location || '',
            startDate: entry.startDate || '',
            endDate: entry.endDate || 'Present',
            achievements: entry.achievements ? [...entry.achievements] : [''],
          };

          const updated = [...currentList, newEntry];
          return {
            resume: {
              ...state.resume,
              experience: updated,
              workExperience: updated, // sync alias
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateExperience: (id, data) => {
        set((state) => {
          if (Array.isArray(id)) {
            return {
              resume: {
                ...state.resume,
                experience: id,
                workExperience: id,
                meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
              },
              saveStatus: 'saved',
              lastSaved: new Date().toISOString(),
            };
          }
          const currentList = state.resume.experience || [];
          const updated = currentList.map((exp) =>
            exp.id === id ? { ...exp, ...data } : exp
          );
          return {
            resume: {
              ...state.resume,
              experience: updated,
              workExperience: updated, // sync alias
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      reorderExperience: (fromIndex, toIndex) => {
        set((state) => {
          const list = [...(state.resume.experience || [])];
          if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
            return state;
          }
          const [moved] = list.splice(fromIndex, 1);
          list.splice(toIndex, 0, moved);
          return {
            resume: {
              ...state.resume,
              experience: list,
              workExperience: list,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      removeExperience: (id) => {
        set((state) => {
          const currentList = state.resume.experience || [];
          const updated = currentList.filter((exp) => exp.id !== id);
          return {
            resume: {
              ...state.resume,
              experience: updated,
              workExperience: updated, // sync alias
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateWorkExperience: (experiences) => {
        set((state) => ({
          resume: {
            ...state.resume,
            experience: experiences,
            workExperience: experiences,
            meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      // -------------------------------------------------------------
      // Education Actions
      // -------------------------------------------------------------
      addEducation: (entry = {}) => {
        set((state) => {
          const currentList = state.resume.education || [];
          const maxId = currentList.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
          const newId = maxId + 1;

          const newEntry = {
            id: newId,
            institutionName: entry.institutionName || '',
            degree: entry.degree || '',
            startYear: entry.startYear || '',
            endYear: entry.endYear || '',
            score: entry.score || '',
          };

          const updated = [...currentList, newEntry];
          return {
            resume: {
              ...state.resume,
              education: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateEducation: (id, data) => {
        set((state) => {
          if (Array.isArray(id)) {
            return {
              resume: {
                ...state.resume,
                education: id,
                meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
              },
              saveStatus: 'saved',
              lastSaved: new Date().toISOString(),
            };
          }
          const currentList = state.resume.education || [];
          const updated = currentList.map((edu) =>
            edu.id === id ? { ...edu, ...data } : edu
          );
          return {
            resume: {
              ...state.resume,
              education: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateEducationList: (educationList) => {
        set((state) => ({
          resume: {
            ...state.resume,
            education: Array.isArray(educationList) ? educationList : [],
            meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      reorderEducation: (fromIndex, toIndex) => {
        set((state) => {
          const list = [...(state.resume.education || [])];
          if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
            return state;
          }
          const [moved] = list.splice(fromIndex, 1);
          list.splice(toIndex, 0, moved);
          return {
            resume: {
              ...state.resume,
              education: list,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      removeEducation: (id) => {
        set((state) => {
          const currentList = state.resume.education || [];
          const updated = currentList.filter((edu) => edu.id !== id);
          return {
            resume: {
              ...state.resume,
              education: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      // -------------------------------------------------------------
      // Skills Actions
      // -------------------------------------------------------------
      addSkillGroup: (group = {}) => {
        set((state) => {
          const currentList = state.resume.skills || [];
          const maxId = currentList.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
          const newId = maxId + 1;

          const newGroup = {
            id: newId,
            groupName: group.groupName || 'Skill Group',
            skills: group.skills ? [...group.skills] : [],
          };

          const updated = [...currentList, newGroup];
          return {
            resume: {
              ...state.resume,
              skills: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateSkillGroup: (id, data) => {
        set((state) => {
          if (Array.isArray(id)) {
            return {
              resume: {
                ...state.resume,
                skills: id,
                meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
              },
              saveStatus: 'saved',
              lastSaved: new Date().toISOString(),
            };
          }
          const currentList = state.resume.skills || [];
          const updated = currentList.map((grp) =>
            grp.id === id ? { ...grp, ...data } : grp
          );
          return {
            resume: {
              ...state.resume,
              skills: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      reorderSkillGroup: (fromIndex, toIndex) => {
        set((state) => {
          const list = [...(state.resume.skills || [])];
          if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
            return state;
          }
          const [moved] = list.splice(fromIndex, 1);
          list.splice(toIndex, 0, moved);
          return {
            resume: {
              ...state.resume,
              skills: list,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      reorderSkills: (fromIndex, toIndex) => get().reorderSkillGroup(fromIndex, toIndex),

      addSkillToGroup: (groupId, skillName) => {
        const trimmed = typeof skillName === 'string' ? skillName.trim() : '';
        if (!trimmed) return false;
        
        const state = get();
        const currentList = state.resume.skills || [];
        const targetGroup = currentList.find((g) => g.id === groupId);
        if (!targetGroup) return false;

        const currentSkills = targetGroup.skills || [];
        // Prevent duplicate (case-insensitive)
        if (currentSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
          return false;
        }

        const updatedGroup = {
          ...targetGroup,
          skills: [...currentSkills, trimmed],
        };
        get().updateSkillGroup(groupId, updatedGroup);
        return true;
      },

      removeSkillFromGroup: (groupId, skillIndex) => {
        const state = get();
        const currentList = state.resume.skills || [];
        const targetGroup = currentList.find((g) => g.id === groupId);
        if (!targetGroup) return;

        const currentSkills = targetGroup.skills || [];
        const updatedSkills = currentSkills.filter((_, idx) => idx !== skillIndex);
        get().updateSkillGroup(groupId, { ...targetGroup, skills: updatedSkills });
      },

      removeSkillGroup: (id) => {
        set((state) => {
          const currentList = state.resume.skills || [];
          const updated = currentList.filter((grp) => grp.id !== id);
          return {
            resume: {
              ...state.resume,
              skills: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateSkills: (skills) => {
        set((state) => ({
          resume: {
            ...state.resume,
            skills,
            meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      // -------------------------------------------------------------
      // Projects Actions
      // -------------------------------------------------------------
      addProject: (project = {}) => {
        set((state) => {
          const currentList = state.resume.projects || [];
          const maxId = currentList.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
          const newId = maxId + 1;

          const newProj = {
            id: newId,
            projectName: project.projectName || '',
            technologies: project.technologies || '',
            projectLink: project.projectLink || '',
            achievements: project.achievements ? [...project.achievements] : [''],
          };

          const updated = [...currentList, newProj];
          return {
            resume: {
              ...state.resume,
              projects: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateProject: (id, data) => {
        set((state) => {
          if (Array.isArray(id)) {
            return {
              resume: {
                ...state.resume,
                projects: id,
                meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
              },
              saveStatus: 'saved',
              lastSaved: new Date().toISOString(),
            };
          }
          const currentList = state.resume.projects || [];
          const updated = currentList.map((prj) =>
            prj.id === id ? { ...prj, ...data } : prj
          );
          return {
            resume: {
              ...state.resume,
              projects: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      reorderProjects: (fromIndex, toIndex) => {
        set((state) => {
          const list = [...(state.resume.projects || [])];
          if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
            return state;
          }
          const [moved] = list.splice(fromIndex, 1);
          list.splice(toIndex, 0, moved);
          return {
            resume: {
              ...state.resume,
              projects: list,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      removeProject: (id) => {
        set((state) => {
          const currentList = state.resume.projects || [];
          const updated = currentList.filter((prj) => prj.id !== id);
          return {
            resume: {
              ...state.resume,
              projects: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateProjects: (projects) => {
        set((state) => ({
          resume: {
            ...state.resume,
            projects,
            meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      // -------------------------------------------------------------
      // Certifications Actions
      // -------------------------------------------------------------
      addCertification: (name = '') => {
        set((state) => {
          const currentList = state.resume.certifications || [];
          const normalized = typeof name === 'string' 
            ? name.trim() 
            : (name && typeof name === 'object' ? (name.certificateName || name.name || name.title || '').trim() : '');
          const updated = normalized ? [...currentList, normalized] : currentList;
          return {
            resume: {
              ...state.resume,
              certifications: updated,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateCertification: (index, value) => {
        set((state) => {
          const currentList = [...(state.resume.certifications || [])];
          if (index >= 0 && index < currentList.length) {
            currentList[index] = typeof value === 'string' 
              ? value.trim() 
              : (value && typeof value === 'object' ? (value.certificateName || value.name || value.title || '').trim() : '');
          }
          return {
            resume: {
              ...state.resume,
              certifications: currentList,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      removeCertification: (index) => {
        set((state) => {
          const currentList = (state.resume.certifications || []).filter((_, i) => i !== index);
          return {
            resume: {
              ...state.resume,
              certifications: currentList,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      reorderCertifications: (fromIndex, toIndex) => {
        set((state) => {
          const list = [...(state.resume.certifications || [])];
          if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
            return state;
          }
          const [moved] = list.splice(fromIndex, 1);
          list.splice(toIndex, 0, moved);
          return {
            resume: {
              ...state.resume,
              certifications: list,
              meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
            },
            saveStatus: 'saved',
            lastSaved: new Date().toISOString(),
          };
        });
      },

      updateCertifications: (certifications) => {
        const cleaned = Array.isArray(certifications)
          ? certifications.map((c) => {
              if (typeof c === 'string') return c.trim();
              if (c && typeof c === 'object') {
                return (c.certificateName || c.name || c.title || (c.issuer ? `${c.name || 'Certificate'} - ${c.issuer}` : 'Certified Professional')).trim();
              }
              return String(c || '').trim();
            }).filter(Boolean)
          : [];
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: cleaned,
            meta: { ...state.resume.meta, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      // -------------------------------------------------------------
      // General Template & Preset Actions
      // -------------------------------------------------------------
      setTemplate: (template) => {
        set((state) => ({
          activeTemplate: template,
          resume: {
            ...state.resume,
            meta: { ...state.resume.meta, template, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      setActiveTemplate: (template) => {
        get().setTemplate(template);
      },

      setAccentColor: (color) => {
        set((state) => ({
          accentColor: color,
          resume: {
            ...state.resume,
            meta: { ...state.resume.meta, accentColor: color, lastSaved: new Date().toISOString() },
          },
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      // -------------------------------------------------------------
      // Lifecycle, Reset, and Load Actions
      // -------------------------------------------------------------
      resetResume: () => {
        const fresh = createDefaultResume(sampleResumeData);
        set({
          resume: fresh,
          activeTemplate: 'classic',
          accentColor: '#111827',
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        });
      },

      resetToSample: () => {
        get().resetResume();
      },

      clearSavedResume: () => {
        const empty = createEmptyResume();
        set({
          resume: empty,
          activeTemplate: 'classic',
          accentColor: '#111827',
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        });
        safeLocalStorage.removeItem(STORAGE_KEY);
      },

      clearAll: () => {
        get().clearSavedResume();
      },

      loadResume: (externalData) => {
        if (!externalData || typeof externalData !== 'object') return;
        const normalized = createDefaultResume(externalData);
        set((state) => ({
          resume: normalized,
          activeTemplate: externalData.meta?.template || state.activeTemplate,
          accentColor: externalData.meta?.accentColor || state.accentColor,
          saveStatus: 'saved',
          lastSaved: new Date().toISOString(),
        }));
      },

      // -------------------------------------------------------------
      // Utility Helpers for UI & PDF Export
      // -------------------------------------------------------------
      calculateCompletion: () => {
        const { resume } = get();
        const { basics, summary, experience, education, skills, projects, certifications } = resume;

        const checklist = [
          {
            id: 'personal',
            title: 'Personal Information',
            completed: Boolean(basics?.fullName && basics?.email && basics?.phone),
            weight: 20,
          },
          {
            id: 'summary',
            title: 'Professional Summary',
            completed: Boolean(summary && summary.trim().length >= 40),
            weight: 15,
          },
          {
            id: 'experience',
            title: 'Work Experience',
            completed: Boolean(
              experience?.length > 0 &&
              experience[0]?.companyName &&
              experience[0]?.jobTitle &&
              experience[0]?.achievements?.filter(Boolean).length > 0
            ),
            weight: 25,
          },
          {
            id: 'education',
            title: 'Education',
            completed: Boolean(education?.length > 0 && education[0]?.institutionName && education[0]?.degree),
            weight: 15,
          },
          {
            id: 'skills',
            title: 'Skills',
            completed: Boolean(skills?.length > 0 && skills[0]?.skills?.length > 0),
            weight: 10,
          },
          {
            id: 'projects',
            title: 'Projects',
            completed: Boolean(projects?.length > 0 && projects[0]?.projectName),
            weight: 10,
          },
          {
            id: 'certifications',
            title: 'Certifications',
            completed: Boolean(certifications?.filter(Boolean).length > 0),
            weight: 5,
          },
        ];

        const totalWeight = checklist.reduce((sum, item) => sum + item.weight, 0);
        const completedWeight = checklist.reduce((sum, item) => sum + (item.completed ? item.weight : 0), 0);
        const percentage = Math.round((completedWeight / totalWeight) * 100);

        return {
          percentage,
          checklist,
          isFullyComplete: percentage >= 80,
        };
      },

      getPlainTextForATS: () => {
        const { resume } = get();
        const { basics, summary, experience, education, skills, projects, certifications } = resume;
        let text = '';

        // Contact Header
        text += `${basics.fullName || 'YOUR NAME'}\n`;
        if (basics.professionalTitle) text += `${basics.professionalTitle}\n`;
        const contacts = [basics.email, basics.phone, basics.location].filter(Boolean).join(' | ');
        if (contacts) text += `${contacts}\n`;
        const links = [basics.linkedinUrl, basics.githubUrl, basics.portfolioUrl].filter(Boolean).join(' | ');
        if (links) text += `${links}\n`;
        text += '\n';

        // Summary
        if (summary) {
          text += `PROFESSIONAL SUMMARY\n--------------------\n${summary}\n\n`;
        }

        // Experience
        if (experience?.length > 0 && experience[0]?.companyName) {
          text += `WORK EXPERIENCE\n--------------------\n`;
          experience.forEach((exp) => {
            text += `${exp.jobTitle || 'Role'} | ${exp.companyName || 'Company'}${exp.location ? ` - ${exp.location}` : ''}\n`;
            text += `${exp.startDate || ''} - ${exp.endDate || 'Present'}\n`;
            if (exp.achievements?.filter(Boolean).length > 0) {
              exp.achievements.filter(Boolean).forEach((ach) => {
                text += `* ${ach}\n`;
              });
            }
            text += '\n';
          });
        }

        // Education
        if (education?.length > 0 && education[0]?.institutionName) {
          text += `EDUCATION\n--------------------\n`;
          education.forEach((edu) => {
            text += `${edu.degree || 'Degree'} | ${edu.institutionName || 'Institution'}\n`;
            text += `${edu.startYear || ''} - ${edu.endYear || 'Present'}${edu.score ? ` | ${edu.score}` : ''}\n\n`;
          });
        }

        // Skills
        if (skills?.length > 0 && skills[0]?.groupName) {
          text += `SKILLS\n--------------------\n`;
          skills.forEach((g) => {
            text += `${g.groupName}: ${g.skills?.join(', ') || ''}\n`;
          });
          text += '\n';
        }

        // Projects
        if (projects?.length > 0 && projects[0]?.projectName) {
          text += `PROJECTS\n--------------------\n`;
          projects.forEach((proj) => {
            text += `${proj.projectName}${proj.technologies ? ` (${proj.technologies})` : ''}\n`;
            if (proj.projectLink) text += `Link: ${proj.projectLink}\n`;
            if (proj.achievements?.filter(Boolean).length > 0) {
              proj.achievements.filter(Boolean).forEach((ach) => {
                text += `* ${ach}\n`;
              });
            }
            text += '\n';
          });
        }

        // Certifications
        if (certifications?.filter(Boolean).length > 0) {
          text += `CERTIFICATIONS\n--------------------\n`;
          certifications.filter(Boolean).forEach((cert) => {
            text += `* ${cert}\n`;
          });
          text += '\n';
        }

        return text.trim();
      },

      downloadJson: () => {
        const { resume, activeTemplate, accentColor } = get();
        const exportData = {
          ...resume,
          meta: {
            ...resume.meta,
            template: activeTemplate,
            accentColor,
            exportedAt: new Date().toISOString(),
          },
        };

        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        const fileName = `${(resume.basics?.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_resume.json`;
        downloadAnchor.setAttribute('download', fileName);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      },

      printResume: () => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      },

      downloadPdf: async () => {
        const state = get();
        return await downloadResumePdf(state.resume, state.activeTemplate, state.accentColor);
      },

      downloadDocx: async () => {
        const state = get();
        return await downloadResumeDocx(state.resume, state.activeTemplate, state.accentColor);
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => safeLocalStorage),
      // Partialize: only persist actual resume contents, template and cloud resume association
      partialize: (state) => ({
        resume: state.resume,
        activeTemplate: state.activeTemplate,
        accentColor: state.accentColor,
        lastSaved: state.lastSaved,
        activeCloudResumeId: state.activeCloudResumeId,
        cloudResumeTitle: state.cloudResumeTitle,
      }),
      // Migration strategy
      migrate: (persistedState, version) => {
        if (version === 0 || !persistedState) {
          return {
            resume: createDefaultResume(sampleResumeData),
            activeTemplate: 'classic',
            accentColor: '#111827',
            lastSaved: new Date().toISOString(),
          };
        }
        if (persistedState?.resume?.certifications && Array.isArray(persistedState.resume.certifications)) {
          persistedState.resume.certifications = persistedState.resume.certifications.map((c) => {
            if (typeof c === 'string') return c.trim();
            if (c && typeof c === 'object') {
              return (c.certificateName || c.name || c.title || (c.issuer ? `${c.name || 'Certificate'} - ${c.issuer}` : 'Certified Professional')).trim();
            }
            return String(c || '').trim();
          }).filter(Boolean);
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[useResumeStore] Hydration error from LocalStorage:', error);
          if (state?.setHasHydrated) state.setHasHydrated(true);
          return;
        }
        if (state?.resume?.certifications && Array.isArray(state.resume.certifications)) {
          state.resume.certifications = state.resume.certifications.map((c) => {
            if (typeof c === 'string') return c.trim();
            if (c && typeof c === 'object') {
              return (c.certificateName || c.name || c.title || (c.issuer ? `${c.name || 'Certificate'} - ${c.issuer}` : 'Certified Professional')).trim();
            }
            return String(c || '').trim();
          }).filter(Boolean);
        }
        if (state?.setHasHydrated) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// -------------------------------------------------------------
// Granular Selectors for Optimal Component Performance
// -------------------------------------------------------------
export const selectResume = (state) => state.resume;
export const selectBasics = (state) => state.resume.basics;
export const selectPersonalInfo = (state) => state.resume.personalInfo;
export const selectSummary = (state) => state.resume.summary;
export const selectExperience = (state) => state.resume.experience;
export const selectEducation = (state) => state.resume.education;
export const selectSkills = (state) => state.resume.skills;
export const selectProjects = (state) => state.resume.projects;
export const selectCertifications = (state) => state.resume.certifications;
export const selectMeta = (state) => state.resume.meta;
export const selectActiveTemplate = (state) => state.activeTemplate;
export const selectAccentColor = (state) => state.accentColor;
export const selectSaveStatus = (state) => ({
  isSaving: state.isSaving,
  saveStatus: state.saveStatus,
  lastSaved: state.lastSaved,
  hasHydrated: state.hasHydrated,
});

export const selectActiveCloudResumeId = (state) => state.activeCloudResumeId;
export const selectCloudResumeTitle = (state) => state.cloudResumeTitle;
export const selectCloudResumes = (state) => state.cloudResumes;
export const selectCloudSyncStatus = (state) => state.cloudSyncStatus;
export const selectLastCloudSynced = (state) => state.lastCloudSynced;

export default useResumeStore;
