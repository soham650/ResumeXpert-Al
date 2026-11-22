import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import RepeatableItemCard from '../components/ui/RepeatableItemCard';
import FormInput from '../components/ui/FormInput';
import TipCard from '../components/ui/TipCard';
import EmptyState from '../components/ui/EmptyState';
import NavigationButtons from '../components/ui/NavigationButtons';
import { useResume } from '../context/ResumeContext';
import { workExperienceSchema } from '../schema/validation';

const WorkExperience = ({ onNext, onPrevious }) => {
  const { resumeData, updateWorkExperience } = useResume();
  const experienceList = resumeData.workExperience || resumeData.experience || [];

  const initialList = experienceList.length > 0 ? experienceList : [
    {
      id: 1,
      companyName: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      achievements: [''],
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience: initialList,
    },
    mode: 'onTouched',
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'workExperience',
  });

  // Track expanded state for each card (default all open)
  const [expandedMap, setExpandedMap] = useState({});

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  // Real-time synchronization to Zustand store for instant live preview updates
  useEffect(() => {
    const subscription = watch((values) => {
      if (values.workExperience) {
        updateWorkExperience(values.workExperience);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWorkExperience]);

  const onValidSubmit = (data) => {
    updateWorkExperience(data.workExperience);
    onNext();
  };

  const handlePreviousClick = () => {
    const values = watch();
    if (values.workExperience) {
      updateWorkExperience(values.workExperience);
    }
    onPrevious();
  };

  const handleAddExperience = () => {
    const newId = Date.now();
    append({
      id: newId,
      companyName: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      achievements: [''],
    });
    setExpandedMap((prev) => ({ ...prev, [newId]: true }));
  };

  const toggleCurrentlyWorking = (index) => {
    const currentVal = watch(`workExperience.${index}.endDate`);
    const isPresent = (currentVal || '').toLowerCase() === 'present';
    setValue(`workExperience.${index}.endDate`, isPresent ? '' : 'Present', { shouldValidate: true });
  };

  const handleAddAchievement = (expIndex) => {
    const currentAchievements = watch(`workExperience.${expIndex}.achievements`) || [];
    setValue(`workExperience.${expIndex}.achievements`, [...currentAchievements, '']);
  };

  const handleRemoveAchievement = (expIndex, achIndex) => {
    const currentAchievements = watch(`workExperience.${expIndex}.achievements`) || [];
    const updated = currentAchievements.filter((_, i) => i !== achIndex);
    setValue(`workExperience.${expIndex}.achievements`, updated.length > 0 ? updated : ['']);
  };

  const handleMoveAchievement = (expIndex, fromIdx, toIdx) => {
    const current = [...(watch(`workExperience.${expIndex}.achievements`) || [''])];
    if (toIdx < 0 || toIdx >= current.length) return;
    const [item] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, item);
    setValue(`workExperience.${expIndex}.achievements`, current);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-6">
      {/* List of Dynamic Experience Cards */}
      {fields.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-subtle p-8 shadow-card">
          <EmptyState
            icon={Briefcase}
            title="No work experience entries yet"
            description="Add your previous or current employment history to showcase your career journey and achievements."
            actionLabel="Add Experience"
            onAction={handleAddExperience}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const company = watch(`workExperience.${index}.companyName`) || '';
            const title = watch(`workExperience.${index}.jobTitle`) || '';
            const startDate = watch(`workExperience.${index}.startDate`) || '';
            const endDate = watch(`workExperience.${index}.endDate`) || '';
            const isPresent = (endDate || '').toLowerCase() === 'present';
            const expErrors = errors.workExperience?.[index];

            const headerTitle = company ? `${company}${title ? ` • ${title}` : ''}` : `Work Experience #${index + 1}`;
            const headerSubtitle = (startDate || endDate) 
              ? `${startDate || 'Start'} — ${endDate || 'End'}`
              : 'Add your role details and achievements';

            const isExpanded = expandedMap[field.id] !== false;

            return (
              <RepeatableItemCard
                key={field.id}
                icon={Briefcase}
                badge={`#${index + 1}`}
                title={headerTitle}
                subtitle={headerSubtitle}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpand(field.id)}
                isFirst={index === 0}
                isLast={index === fields.length - 1}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                onRemove={() => remove(index)}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Company Name"
                      placeholder="e.g. Tech Corp"
                      required
                      error={expErrors?.companyName?.message}
                      {...register(`workExperience.${index}.companyName`)}
                    />
                    <FormInput
                      label="Job Title"
                      placeholder="e.g. Senior Developer"
                      required
                      error={expErrors?.jobTitle?.message}
                      {...register(`workExperience.${index}.jobTitle`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormInput
                      label="Location"
                      placeholder="e.g. Nagpur, India"
                      error={expErrors?.location?.message}
                      {...register(`workExperience.${index}.location`)}
                    />
                    <FormInput
                      label="Start Date"
                      placeholder="e.g. Jan 2024"
                      required
                      error={expErrors?.startDate?.message}
                      {...register(`workExperience.${index}.startDate`)}
                    />
                    <div>
                      <FormInput
                        label="End Date"
                        placeholder="e.g. Present"
                        required
                        disabled={isPresent}
                        error={expErrors?.endDate?.message}
                        {...register(`workExperience.${index}.endDate`)}
                      />
                      <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer text-xs text-body hover:text-heading select-none">
                        <input
                          type="checkbox"
                          checked={isPresent}
                          onChange={() => toggleCurrentlyWorking(index)}
                          className="rounded text-primary-600 focus:ring-primary-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>Currently work here</span>
                      </label>
                    </div>
                  </div>

                  {/* Achievements Bullet Points */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-heading">
                        Key Achievements & Responsibilities
                      </label>
                      <span className="text-xs text-body">
                        {(watch(`workExperience.${index}.achievements`) || ['']).length} bullet point(s)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(watch(`workExperience.${index}.achievements`) || ['']).map((_, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0 ml-1" />
                          <input
                            type="text"
                            placeholder="e.g. Built scalable web applications, improved performance by 40%..."
                            className="flex-1 rounded-xl border border-border-light bg-white px-3.5 py-2.5 text-sm text-heading placeholder:text-[#A09EB0] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-all"
                            {...register(`workExperience.${index}.achievements.${achIndex}`)}
                          />

                          {/* Bullet order controls */}
                          <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              disabled={achIndex === 0}
                              onClick={() => handleMoveAchievement(index, achIndex, achIndex - 1)}
                              aria-label="Move bullet up"
                              title="Move bullet up"
                              className="p-1 text-body hover:text-heading hover:bg-surface-100 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={achIndex === (watch(`workExperience.${index}.achievements`)?.length || 1) - 1}
                              onClick={() => handleMoveAchievement(index, achIndex, achIndex + 1)}
                              aria-label="Move bullet down"
                              title="Move bullet down"
                              className="p-1 text-body hover:text-heading hover:bg-surface-100 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            {(watch(`workExperience.${index}.achievements`)?.length || 0) > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAchievement(index, achIndex)}
                                className="p-1 text-body hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                title="Remove bullet"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddAchievement(index)}
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all duration-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Achievement Bullet</span>
                    </button>
                  </div>
                </div>
              </RepeatableItemCard>
            );
          })}
        </div>
      )}

      {/* Global Array Level Validation Error */}
      {errors.workExperience?.message && (
        <p className="text-sm font-semibold text-rose-500" role="alert">
          {errors.workExperience.message}
        </p>
      )}

      {/* Add Experience Button */}
      <button
        type="button"
        onClick={handleAddExperience}
        className="btn-outline-dashed"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Experience</span>
      </button>

      <TipCard
        title="Tip"
        tips={[
          'Use bullet points starting with strong action verbs (e.g., Developed, Optimized, Architected).',
          'Quantify results wherever possible to stand out to hiring managers and automated ATS screeners.',
        ]}
      />

      <NavigationButtons
        showPrevious={true}
        onNext={handleSubmit(onValidSubmit)}
        onPrevious={handlePreviousClick}
      />
    </form>
  );
};

export default WorkExperience;
