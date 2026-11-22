import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderOpen, Plus, X, Link2, ArrowUp, ArrowDown } from 'lucide-react';
import RepeatableItemCard from '../components/ui/RepeatableItemCard';
import FormInput from '../components/ui/FormInput';
import TipCard from '../components/ui/TipCard';
import EmptyState from '../components/ui/EmptyState';
import NavigationButtons from '../components/ui/NavigationButtons';
import { useResume } from '../context/ResumeContext';
import { projectsSchema } from '../schema/validation';

const Projects = ({ onNext, onPrevious }) => {
  const { resumeData, updateProjects } = useResume();
  const projectList = resumeData.projects || [];

  const initialList = projectList.length > 0 ? projectList : [
    {
      id: 1,
      projectName: '',
      technologies: '',
      projectLink: '',
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
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: initialList,
    },
    mode: 'onTouched',
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'projects',
  });

  // Track expanded state for each card
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
      if (values.projects) {
        updateProjects(values.projects);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProjects]);

  const onValidSubmit = (data) => {
    updateProjects(data.projects);
    onNext();
  };

  const handlePreviousClick = () => {
    const values = watch();
    if (values.projects) {
      updateProjects(values.projects);
    }
    onPrevious();
  };

  const handleAddProject = () => {
    const newId = Date.now();
    append({
      id: newId,
      projectName: '',
      technologies: '',
      projectLink: '',
      achievements: [''],
    });
    setExpandedMap((prev) => ({ ...prev, [newId]: true }));
  };

  const handleAddAchievement = (projIndex) => {
    const current = watch(`projects.${projIndex}.achievements`) || [];
    setValue(`projects.${projIndex}.achievements`, [...current, '']);
  };

  const handleRemoveAchievement = (projIndex, achIndex) => {
    const current = watch(`projects.${projIndex}.achievements`) || [];
    const updated = current.filter((_, i) => i !== achIndex);
    setValue(`projects.${projIndex}.achievements`, updated.length > 0 ? updated : ['']);
  };

  const handleMoveAchievement = (projIndex, fromIdx, toIdx) => {
    const current = [...(watch(`projects.${projIndex}.achievements`) || [''])];
    if (toIdx < 0 || toIdx >= current.length) return;
    const [item] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, item);
    setValue(`projects.${projIndex}.achievements`, current);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-6">
      {fields.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-subtle p-8 shadow-card">
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Highlight key software apps, open-source work, or portfolio initiatives you've designed and delivered."
            actionLabel="Add Project"
            onAction={handleAddProject}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const name = watch(`projects.${index}.projectName`) || '';
            const tech = watch(`projects.${index}.technologies`) || '';
            const link = watch(`projects.${index}.projectLink`) || '';
            const projErrors = errors.projects?.[index];

            const headerTitle = name 
              ? `${name}${tech ? ` • ${tech}` : ''}`
              : `Project #${index + 1}`;
            
            const headerSubtitle = link || 'Add project scope, tech stack, and impact bullets';
            const isExpanded = expandedMap[field.id] !== false;

            return (
              <RepeatableItemCard
                key={field.id}
                icon={FolderOpen}
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
                  <FormInput
                    label="Project Name"
                    placeholder="e.g. Inventory SaaS, DevMetrics CLI"
                    required
                    error={projErrors?.projectName?.message}
                    {...register(`projects.${index}.projectName`)}
                  />

                  <FormInput
                    label="Technologies Used"
                    placeholder="e.g. React, Supabase, Tailwind, TypeScript"
                    error={projErrors?.technologies?.message}
                    {...register(`projects.${index}.technologies`)}
                  />

                  <FormInput
                    label="Project Link / Repository"
                    placeholder="e.g. https://github.com/yourname/project"
                    icon={Link2}
                    error={projErrors?.projectLink?.message}
                    {...register(`projects.${index}.projectLink`)}
                  />

                  {/* Key Achievements Bullet Points */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-heading">
                        Key Achievements & Highlights
                      </label>
                      <span className="text-xs text-body">
                        {(watch(`projects.${index}.achievements`) || ['']).length} bullet point(s)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(watch(`projects.${index}.achievements`) || ['']).map((_, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0 ml-1" />
                          <input
                            type="text"
                            placeholder="e.g. Built multi-tenant POS, Served 10K+ monthly active users..."
                            className="flex-1 rounded-xl border border-border-light bg-white px-3.5 py-2.5 text-sm text-heading placeholder:text-[#A09EB0] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-all"
                            {...register(`projects.${index}.achievements.${achIndex}`)}
                          />

                          {/* Bullet order & remove controls */}
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
                              disabled={achIndex === (watch(`projects.${index}.achievements`)?.length || 1) - 1}
                              onClick={() => handleMoveAchievement(index, achIndex, achIndex + 1)}
                              aria-label="Move bullet down"
                              title="Move bullet down"
                              className="p-1 text-body hover:text-heading hover:bg-surface-100 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            {(watch(`projects.${index}.achievements`)?.length || 0) > 1 && (
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
      {errors.projects?.message && (
        <p className="text-sm font-semibold text-rose-500" role="alert">
          {errors.projects.message}
        </p>
      )}

      {/* Add Project Button */}
      <button
        type="button"
        onClick={handleAddProject}
        className="btn-outline-dashed"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </button>

      <TipCard
        title="Tip"
        tips={[
          'Include live demo links or public GitHub repositories to validate your real-world experience.',
          'Focus on specific metrics and technical challenges you solved.',
        ]}
      />

      <NavigationButtons
        onNext={handleSubmit(onValidSubmit)}
        onPrevious={handlePreviousClick}
        showPrevious={true}
      />
    </form>
  );
};

export default Projects;
