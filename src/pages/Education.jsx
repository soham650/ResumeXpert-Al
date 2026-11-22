import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Plus } from 'lucide-react';
import RepeatableItemCard from '../components/ui/RepeatableItemCard';
import FormInput from '../components/ui/FormInput';
import TipCard from '../components/ui/TipCard';
import EmptyState from '../components/ui/EmptyState';
import NavigationButtons from '../components/ui/NavigationButtons';
import { useResume } from '../context/ResumeContext';
import { educationSchema } from '../schema/validation';

const Education = ({ onNext, onPrevious }) => {
  const { resumeData, updateEducation, updateEducationList } = useResume();
  const educations = resumeData.education || [];

  const initialList = educations.length > 0 ? educations : [
    {
      id: 1,
      institutionName: '',
      degree: '',
      startYear: '',
      endYear: '',
      score: '',
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: initialList,
    },
    mode: 'onTouched',
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'education',
  });

  // Track expanded state for each card
  const [expandedMap, setExpandedMap] = useState({});

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  // Safe sync to store (both methods supported)
  const syncToStore = (list) => {
    if (updateEducationList) {
      updateEducationList(list);
    } else if (updateEducation) {
      updateEducation(list);
    }
  };

  // Real-time synchronization to Zustand store for instant live preview updates
  useEffect(() => {
    const subscription = watch((values) => {
      if (values.education) {
        syncToStore(values.education);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onValidSubmit = (data) => {
    syncToStore(data.education);
    onNext();
  };

  const handlePreviousClick = () => {
    const values = watch();
    if (values.education) {
      syncToStore(values.education);
    }
    onPrevious();
  };

  const handleAddEducation = () => {
    const newId = Date.now();
    append({
      id: newId,
      institutionName: '',
      degree: '',
      startYear: '',
      endYear: '',
      score: '',
    });
    setExpandedMap((prev) => ({ ...prev, [newId]: true }));
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-6">
      {fields.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-subtle p-8 shadow-card">
          <EmptyState
            icon={GraduationCap}
            title="No education entries yet"
            description="Add your degree, university or college details to establish your academic qualifications."
            actionLabel="Add Education"
            onAction={handleAddEducation}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const institution = watch(`education.${index}.institutionName`) || '';
            const degree = watch(`education.${index}.degree`) || '';
            const startYear = watch(`education.${index}.startYear`) || '';
            const endYear = watch(`education.${index}.endYear`) || '';
            const eduErrors = errors.education?.[index];

            const headerTitle = degree 
              ? `${degree}${institution ? ` • ${institution}` : ''}`
              : institution || `Education #${index + 1}`;
            
            const headerSubtitle = (startYear || endYear)
              ? `${startYear || 'Start'} — ${endYear || 'End'}`
              : 'Add your degree, college and graduation timeline';

            const isExpanded = expandedMap[field.id] !== false;

            return (
              <RepeatableItemCard
                key={field.id}
                icon={GraduationCap}
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
                    label="Institution"
                    placeholder="e.g. Your College"
                    required
                    error={eduErrors?.institutionName?.message}
                    {...register(`education.${index}.institutionName`)}
                  />
                  <FormInput
                    label="Degree"
                    placeholder="e.g. B.E. Computer Science"
                    required
                    error={eduErrors?.degree?.message}
                    {...register(`education.${index}.degree`)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Start Year"
                      placeholder="e.g. 2022"
                      error={eduErrors?.startYear?.message}
                      {...register(`education.${index}.startYear`)}
                    />
                    <FormInput
                      label="End Year"
                      placeholder="e.g. 2026"
                      error={eduErrors?.endYear?.message}
                      {...register(`education.${index}.endYear`)}
                    />
                  </div>
                  <FormInput
                    label="Score / CGPA"
                    placeholder="e.g. 8.2 CGPA or 3.8/4.0"
                    error={eduErrors?.score?.message}
                    {...register(`education.${index}.score`)}
                  />
                </div>
              </RepeatableItemCard>
            );
          })}
        </div>
      )}

      {/* Global Array Level Validation Error */}
      {errors.education?.message && (
        <p className="text-sm font-semibold text-rose-500" role="alert">
          {errors.education.message}
        </p>
      )}

      {/* Add Education Button */}
      <button
        type="button"
        onClick={handleAddEducation}
        className="btn-outline-dashed"
      >
        <Plus className="w-4 h-4" />
        <span>Add Education</span>
      </button>

      <TipCard
        title="Tip"
        tips={[
          'List your highest and most recent degree first.',
          'Include your graduation year and grade / CGPA if it is above 7.5 or 3.0.',
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

export default Education;
