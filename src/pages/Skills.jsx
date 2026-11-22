import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Code2, Plus, X, Sparkles } from 'lucide-react';
import RepeatableItemCard from '../components/ui/RepeatableItemCard';
import FormInput from '../components/ui/FormInput';
import TipCard from '../components/ui/TipCard';
import EmptyState from '../components/ui/EmptyState';
import NavigationButtons from '../components/ui/NavigationButtons';
import { useResume } from '../context/ResumeContext';
import { skillsSchema } from '../schema/validation';

const SUGGESTED_GROUPS = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Tools & Technologies',
  'Cloud & DevOps',
  'Soft Skills',
];

const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 
  'SQL', 'Tailwind CSS', 'Docker', 'AWS', 'Git', 'REST APIs', 'PostgreSQL'
];

const Skills = ({ onNext, onPrevious }) => {
  const { resumeData, updateSkills } = useResume();
  const skillGroups = resumeData.skills || [];

  const initialList = skillGroups.length > 0 ? skillGroups : [
    { id: 1, groupName: 'Languages', skills: ['JavaScript', 'Python', 'TypeScript'] },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: initialList,
    },
    mode: 'onTouched',
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'skills',
  });

  const [newSkillInputs, setNewSkillInputs] = useState({});
  const [duplicateErrors, setDuplicateErrors] = useState({});
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
      if (values.skills) {
        updateSkills(values.skills);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSkills]);

  const onValidSubmit = (data) => {
    updateSkills(data.skills);
    onNext();
  };

  const handlePreviousClick = () => {
    const values = watch();
    if (values.skills) {
      updateSkills(values.skills);
    }
    onPrevious();
  };

  const handleAddSkillGroup = (customName = '') => {
    const newId = Date.now();
    append({
      id: newId,
      groupName: customName || '',
      skills: [],
    });
    setExpandedMap((prev) => ({ ...prev, [newId]: true }));
  };

  const handleAddSkillToGroup = (groupIndex, skillToAdd) => {
    const value = (skillToAdd || newSkillInputs[groupIndex] || '').trim();
    if (!value) return;

    const currentSkills = watch(`skills.${groupIndex}.skills`) || [];
    
    // Prevent duplicate entries (case-insensitive)
    if (currentSkills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setDuplicateErrors((prev) => ({
        ...prev,
        [groupIndex]: `"${value}" is already in this category`,
      }));
      return;
    }

    setDuplicateErrors((prev) => ({ ...prev, [groupIndex]: '' }));
    clearErrors(`skills.${groupIndex}.skills`);
    
    const updated = [...currentSkills, value];
    setValue(`skills.${groupIndex}.skills`, updated, { shouldValidate: true });
    setNewSkillInputs((prev) => ({ ...prev, [groupIndex]: '' }));
  };

  const handleRemoveSkill = (groupIndex, skillIndex) => {
    const currentSkills = watch(`skills.${groupIndex}.skills`) || [];
    const updated = currentSkills.filter((_, i) => i !== skillIndex);
    setValue(`skills.${groupIndex}.skills`, updated, { shouldValidate: true });
    setDuplicateErrors((prev) => ({ ...prev, [groupIndex]: '' }));
  };

  const handleKeyDown = (e, groupIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkillToGroup(groupIndex);
    }
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-6">
      {/* Category Suggestions Bar */}
      <div className="bg-surface-50 border border-border-light rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-heading uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          <span>Quick Suggested Categories</span>
        </div>
        <p className="text-xs text-body mb-3">
          Click to quickly add standard industry groupings to organize your resume:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_GROUPS.map((sugg) => {
            const currentGroups = watch('skills') || [];
            const exists = currentGroups.some(
              (g) => (g.groupName || '').toLowerCase() === sugg.toLowerCase()
            );

            return (
              <button
                key={sugg}
                type="button"
                disabled={exists}
                onClick={() => handleAddSkillGroup(sugg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  exists
                    ? 'bg-surface-200 text-body/60 border border-transparent cursor-not-allowed'
                    : 'bg-white hover:bg-primary-50 text-heading hover:text-primary-700 border border-border-subtle shadow-xs hover:border-primary-300'
                }`}
              >
                {exists ? `✓ ${sugg}` : `+ ${sugg}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* List of Dynamic Skill Categories */}
      {fields.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-subtle p-8 shadow-card">
          <EmptyState
            icon={Code2}
            title="No skill categories yet"
            description="Organize your technical and professional abilities into clear categories to match recruiter searches."
            actionLabel="Add Skill Category"
            onAction={() => handleAddSkillGroup()}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const groupName = watch(`skills.${index}.groupName`) || '';
            const currentSkills = watch(`skills.${index}.skills`) || [];
            const groupErrors = errors.skills?.[index];
            const duplicateMsg = duplicateErrors[index];

            const headerTitle = groupName || `Skill Category #${index + 1}`;
            const headerSubtitle = currentSkills.length > 0 
              ? `${currentSkills.length} skill(s): ${currentSkills.slice(0, 4).join(', ')}${currentSkills.length > 4 ? '...' : ''}`
              : 'Add skills as removable tags';

            const isExpanded = expandedMap[field.id] !== false;

            return (
              <RepeatableItemCard
                key={field.id}
                icon={Code2}
                badge={`Category #${index + 1}`}
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
                    label="Skill Group Name"
                    placeholder="e.g. Languages, Frameworks, Tools, Soft Skills"
                    required
                    error={groupErrors?.groupName?.message}
                    {...register(`skills.${index}.groupName`)}
                  />

                  {/* Tag Pills */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-heading">
                        Skills in this Category
                      </label>
                      <span className="text-xs text-body">
                        {currentSkills.length} added
                      </span>
                    </div>

                    {currentSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {currentSkills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-50 border border-border-light text-heading text-xs font-semibold hover:border-primary-300 transition-colors group"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(index, skillIndex)}
                              className="p-0.5 text-body hover:text-rose-600 rounded transition-colors"
                              title={`Remove ${skill}`}
                              aria-label={`Remove ${skill}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-body italic mb-3">
                        No skills added to this category yet. Type below and press Enter.
                      </p>
                    )}

                    {/* Duplicate or Schema Errors */}
                    {(duplicateMsg || groupErrors?.skills?.message) && (
                      <p className="text-xs font-semibold text-rose-500 mb-2" role="alert">
                        {duplicateMsg || groupErrors?.skills?.message}
                      </p>
                    )}

                    {/* Add Skill Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a skill and press Enter (e.g. React, PostgreSQL)"
                        value={newSkillInputs[index] || ''}
                        onChange={(e) => {
                          setNewSkillInputs((prev) => ({ ...prev, [index]: e.target.value }));
                          if (duplicateErrors[index]) {
                            setDuplicateErrors((prev) => ({ ...prev, [index]: '' }));
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="flex-1 rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-heading placeholder:text-[#A09EB0] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSkillToGroup(index)}
                        className="btn-primary py-2.5 px-4 text-xs font-bold shrink-0 inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    {/* Quick Suggestions for individual skills */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-body mr-1">Quick add:</span>
                      {POPULAR_SKILLS.map((sugg) => {
                        const exists = currentSkills.some(
                          (s) => s.toLowerCase() === sugg.toLowerCase()
                        );
                        if (exists) return null;
                        return (
                          <button
                            key={sugg}
                            type="button"
                            onClick={() => handleAddSkillToGroup(index, sugg)}
                            className="px-2 py-0.5 rounded-md bg-surface-100 hover:bg-primary-50 text-body hover:text-primary-700 border border-border-subtle transition-colors text-[11px] font-medium"
                          >
                            + {sugg}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </RepeatableItemCard>
            );
          })}
        </div>
      )}

      {/* Global Array Level Validation Error */}
      {errors.skills?.message && (
        <p className="text-sm font-semibold text-rose-500" role="alert">
          {errors.skills.message}
        </p>
      )}

      {/* Add Skill Group Button */}
      <button
        type="button"
        onClick={() => handleAddSkillGroup()}
        className="btn-outline-dashed"
      >
        <Plus className="w-4 h-4" />
        <span>Add Custom Skill Group</span>
      </button>

      <TipCard
        title="Tip"
        tips={[
          'Group your skills into clear categories like Languages, Frameworks, and Cloud Tools.',
          'Recruiter search filters prioritize resumes with accurate keyword matches in the skills section.',
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

export default Skills;
