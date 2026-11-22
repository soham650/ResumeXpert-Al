import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Briefcase, 
  Calendar, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Save, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useResume } from '../../context/ResumeContext';

const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { user, profile, updateProfile, isAuthenticated } = useAuth();
  const { resumeData, updateBasics, updateEducationList } = useResume();

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'education' | 'account'
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Personal Info Form State
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Education History Form State
  const [educationList, setEducationList] = useState([]);
  const [syncToResume, setSyncToResume] = useState(true);

  // Initialize form fields from user profile and resume basics
  useEffect(() => {
    if (isOpen) {
      setSuccessMessage('');
      setErrorMessage('');

      const basics = resumeData.personalInfo || resumeData.basics || {};
      const initialName = profile?.full_name || user?.user_metadata?.full_name || basics.fullName || '';
      const initialEmail = user?.email || basics.email || '';

      setFullName(initialName);
      setProfessionalTitle(basics.professionalTitle || '');
      setEmail(initialEmail);
      setPhone(basics.phone || '');
      setLocation(basics.location || '');
      setLinkedinUrl(basics.linkedinUrl || '');
      setPortfolioUrl(basics.portfolioUrl || '');

      // Load education list
      const existingEdu = Array.isArray(resumeData.education) && resumeData.education.length > 0
        ? resumeData.education.map((edu, idx) => ({
            id: edu.id || Date.now() + idx,
            institutionName: edu.institutionName || '',
            degree: edu.degree || '',
            startYear: edu.startYear || '',
            endYear: edu.endYear || '',
            score: edu.score || '',
          }))
        : [
            {
              id: Date.now(),
              institutionName: '',
              degree: '',
              startYear: '',
              endYear: '',
              score: '',
            },
          ];

      setEducationList(existingEdu);
    }
  }, [isOpen, profile, user, resumeData]);

  if (!isOpen) return null;

  // Education array handlers
  const handleAddEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        id: Date.now(),
        institutionName: '',
        degree: '',
        startYear: '',
        endYear: '',
        score: '',
      },
    ]);
  };

  const handleRemoveEducation = (id) => {
    if (educationList.length === 1) {
      setEducationList([
        {
          id: Date.now(),
          institutionName: '',
          degree: '',
          startYear: '',
          endYear: '',
          score: '',
        },
      ]);
      return;
    }
    setEducationList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEducationChange = (id, field, value) => {
    setEducationList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Save handler
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const cleanName = fullName.trim();
      if (!cleanName) {
        setErrorMessage('Full name is required.');
        setSaving(false);
        return;
      }

      // 1. Update Supabase Profile if authenticated
      if (isAuthenticated && updateProfile) {
        await updateProfile({ fullName: cleanName });
      }

      // 2. Sync to Resume Data (Basics & Education)
      if (syncToResume) {
        if (updateBasics) {
          updateBasics({
            fullName: cleanName,
            professionalTitle: professionalTitle.trim(),
            email: email.trim(),
            phone: phone.trim(),
            location: location.trim(),
            linkedinUrl: linkedinUrl.trim(),
            portfolioUrl: portfolioUrl.trim(),
          });
        }

        if (updateEducationList) {
          // Clean empty trailing entries if any
          const validEdu = educationList.filter(
            (edu) => edu.institutionName.trim() || edu.degree.trim()
          );
          updateEducationList(validEdu.length > 0 ? validEdu : educationList);
        }
      }

      setSuccessMessage('Account information & education details saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update account information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col my-auto max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6335F5] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] flex items-center gap-2">
                <span>Account & Profile Settings</span>
                {isAuthenticated && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Update personal information and educational details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Responsive Scrollable) */}
        <div className="px-5 sm:px-8 pt-3 border-b border-gray-100 bg-gray-50/50 flex gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-[#6335F5] text-[#6335F5] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-[#6335F5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'education'
                ? 'border-[#6335F5] text-[#6335F5] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-[#6335F5]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Educational Details</span>
            <span className="text-[10px] bg-purple-100 text-[#6335F5] px-1.5 py-0.2 rounded-full font-bold">
              {educationList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'account'
                ? 'border-[#6335F5] text-[#6335F5] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-[#6335F5]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Sessions</span>
          </button>
        </div>

        {/* Alert Feedback Banners */}
        {successMessage && (
          <div className="mx-5 sm:mx-8 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-5 sm:mx-8 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Soham Jamkar"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Professional Title / Headline
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    placeholder="e.g. Full-Stack AI Engineer / Software Developer"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      readOnly={Boolean(isAuthenticated)}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className={`w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 outline-none transition-all ${
                        isAuthenticated
                          ? 'bg-gray-50 text-gray-600 cursor-not-allowed'
                          : 'focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100'
                      }`}
                    />
                  </div>
                  {isAuthenticated && (
                    <p className="text-[10px] text-gray-500 mt-1">Verified with Supabase Auth</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Location (City, Country)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune, Maharashtra, India"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Portfolio / Website URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDUCATIONAL DETAILS */}
          {activeTab === 'education' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#111827]">
                    Education History & Degrees
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Add college, university, high school, and specializations
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6335F5] text-xs font-bold transition-all border border-purple-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {educationList.map((edu, index) => (
                <div
                  key={edu.id || index}
                  className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200 hover:border-purple-200 transition-all space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                      Education #{index + 1}
                    </span>
                    {educationList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete this education entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Institution / University Name
                      </label>
                      <input
                        type="text"
                        value={edu.institutionName}
                        onChange={(e) =>
                          handleEducationChange(edu.id, 'institutionName', e.target.value)
                        }
                        placeholder="e.g. Pune University / Berkeley"
                        className="w-full text-xs pl-3 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-1 focus:ring-purple-200 bg-white outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Degree & Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(edu.id, 'degree', e.target.value)
                        }
                        placeholder="e.g. B.Tech Computer Science"
                        className="w-full text-xs pl-3 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-1 focus:ring-purple-200 bg-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Start Year
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'startYear', e.target.value)
                          }
                          placeholder="e.g. 2020"
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-1 focus:ring-purple-200 bg-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        End / Graduation Year
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'endYear', e.target.value)
                          }
                          placeholder="e.g. 2024"
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-1 focus:ring-purple-200 bg-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Score / CGPA / %
                      </label>
                      <div className="relative">
                        <Award className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'score', e.target.value)
                          }
                          placeholder="e.g. 8.8 CGPA / 85%"
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-1 focus:ring-purple-200 bg-white outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Sync to Resume Option */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sync-to-resume-chk"
                  checked={syncToResume}
                  onChange={(e) => setSyncToResume(e.target.checked)}
                  className="w-4 h-4 text-[#6335F5] rounded border-gray-300 focus:ring-purple-400 accent-[#6335F5]"
                />
                <label htmlFor="sync-to-resume-chk" className="text-xs font-semibold text-[#111827] cursor-pointer">
                  Sync these details directly to the Active Resume Builder
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT & SESSIONS */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Authentication Status
                </h4>
                <div className="flex items-center justify-between py-2 border-b border-gray-200/60">
                  <span className="text-xs text-gray-600">Auth Method</span>
                  <span className="text-xs font-bold text-[#111827]">
                    {user?.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Email & Password'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200/60">
                  <span className="text-xs text-gray-600">Account Email</span>
                  <span className="text-xs font-bold text-[#111827]">{user?.email || 'Local Guest'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200/60">
                  <span className="text-xs text-gray-600">Single Device Policy</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Enforced (1 Device Active)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Enterprise Session Protection
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Your account is protected with single-session concurrency. Logging into another phone or laptop will automatically sign out older devices.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer (Sticky) */}
        <div className="px-5 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5025D1] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;

