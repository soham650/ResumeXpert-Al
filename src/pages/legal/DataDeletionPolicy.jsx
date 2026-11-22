import React, { useState } from 'react';
import { ArrowLeft, Trash2, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Lock, Database, Mail } from 'lucide-react';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';
import { purgeAllLocalData, requestFullAccountDeletion } from '../../lib/accountDeletionService';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';

export default function DataDeletionPolicy({ onBackToHome }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const { clearAll } = useResume();

  const [purgingLocal, setPurgingLocal] = useState(false);
  const [localStatus, setLocalStatus] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [accountStatus, setAccountStatus] = useState('');
  const [confirmAccountInput, setConfirmAccountInput] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);

  const handlePurgeLocal = async () => {
    if (!window.confirm('Are you sure you want to delete all local resume drafts, career journeys, and cached preferences from this browser? This cannot be undone.')) {
      return;
    }
    setPurgingLocal(true);
    setLocalStatus('');
    try {
      const res = await purgeAllLocalData();
      clearAll();
      setLocalStatus(res.message);
    } catch (e) {
      setLocalStatus(`Error clearing local data: ${e.message}`);
    } finally {
      setPurgingLocal(false);
    }
  };

  const handleConfirmAccountDeletion = async () => {
    if (confirmAccountInput !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setDeletingAccount(true);
    setAccountStatus('');
    try {
      const res = await requestFullAccountDeletion(user?.id);
      setAccountStatus(res.message);
      setShowAccountModal(false);
      setConfirmAccountInput('');
      await signOut();
    } catch (e) {
      setAccountStatus(`Deletion failed: ${e.message}`);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6335F5] hover:text-[#5225e0] bg-white px-3.5 py-1.5 rounded-full border border-purple-100 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Data Deletion Policy & Self-Service Center
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Effective Date: {APP_CONFIG.legalEffectiveDate} • Last Updated: {APP_CONFIG.lastUpdatedDate}
          </p>
          <p className="text-sm text-[#374151] leading-relaxed">
            At {APP_CONFIG.name}, we uphold your fundamental right to be forgotten. This policy explains our data deletion architecture, cascade procedures, and provides verified self-service tools to permanently delete your data.
          </p>
        </div>

        {/* Self-Service Deletion Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Clear Local Storage */}
          <div className="bg-white rounded-3xl border border-border-light p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <Database className="w-4 h-4 text-[#6335F5]" />
                <span>Clear Local Device Data</span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Removes all active resume drafts, offline career journeys, AI consent flags, and cached templates stored in this browser.
              </p>
            </div>

            {localStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{localStatus}</span>
              </div>
            )}

            <button
              onClick={handlePurgeLocal}
              disabled={purgingLocal}
              className="btn-secondary py-2.5 px-4 text-xs font-bold text-rose-700 hover:bg-rose-50 border-rose-200 flex items-center justify-center gap-2 w-full"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{purgingLocal ? 'Purging Local Data...' : 'Purge All Local Device Data'}</span>
            </button>
          </div>

          {/* Card 2: Delete Cloud Account */}
          <div className="bg-white rounded-3xl border border-border-light p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-700">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Permanent Cloud Account Deletion</span>
              </div>
              <p className="text-xs text-[#6B7280]">
                {isAuthenticated
                  ? `Permanently purges your Supabase account (${user?.email}), all cloud resumes, job applications, interview history, and database records.`
                  : 'Sign in to access your cloud account records and execute verified server-side deletion.'}
              </p>
            </div>

            {accountStatus && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6335F5] shrink-0" />
                <span>{accountStatus}</span>
              </div>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => setShowAccountModal(true)}
                className="btn-primary py-2.5 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 w-full shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Cloud Account Permanently</span>
              </button>
            ) : (
              <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-500 text-center font-medium">
                Not signed in to a cloud account
              </div>
            )}
          </div>
        </div>

        {/* Modal: Account Deletion Confirmation */}
        {showAccountModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-border-light max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-[#111827]">
                  Permanent Account Deletion
                </h3>
                <p className="text-xs text-[#6B7280]">
                  This action is strictly irreversible. All cloud resumes, versions, and applications for <strong>{user?.email}</strong> will be permanently deleted.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#374151]">
                  Type <span className="font-mono text-rose-600 font-black">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmAccountInput}
                  onChange={(e) => setConfirmAccountInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAccountModal(false);
                    setConfirmAccountInput('');
                  }}
                  className="btn-secondary py-2 flex-1 text-xs font-bold justify-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAccountDeletion}
                  disabled={deletingAccount || confirmAccountInput !== 'DELETE'}
                  className="btn-primary py-2 flex-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white justify-center disabled:opacity-40"
                >
                  {deletingAccount ? 'Deleting...' : 'Confirm Deletion'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Explanation Sections */}
        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#374151] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">1. What Gets Deleted</h2>
            <p>
              When an account deletion request is executed, our database cascading delete routines permanently erase:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4B5563]">
              <li><strong>Saved Cloud Resumes:</strong> All active and historical resume drafts across all templates.</li>
              <li><strong>Job Applications:</strong> All pipeline Kanban entries, notes, and company interview logs.</li>
              <li><strong>Mock Interview Transcripts:</strong> Audio speech recognition text transcripts and STAR evaluations.</li>
              <li><strong>Skill Roadmaps:</strong> Generated learning curriculums and checked-off milestone tasks.</li>
              <li><strong>Authentication Profile:</strong> User profile and credentials in Supabase Auth.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">2. Deletion Timeline & Verification</h2>
            <p>
              Because our database is architected with PostgreSQL foreign key cascading rules (<code>ON DELETE CASCADE</code>), deletion executes <strong>synchronously in real-time</strong>. We do not retain soft-deleted ghost records or maintain shadow copies of your career information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">3. Manual Deletion Requests via Email</h2>
            <p>
              If you are unable to access your account or require manual verification of personal data deletion, you may email our data protection officer:
            </p>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6335F5] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111827]">Data Deletion Inquiries:</p>
                {isSupportEmailConfigured ? (
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=Data%20Deletion%20Request`} className="text-xs text-[#6335F5] font-bold underline">
                    {SUPPORT_EMAIL}
                  </a>
                ) : (
                  <span className="text-xs font-mono text-gray-500 font-bold">
                    {SUPPORT_EMAIL}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
