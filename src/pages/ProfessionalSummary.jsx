import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Sparkles, Check } from 'lucide-react';
import FormCard from '../components/ui/FormCard';
import FormTextarea from '../components/ui/FormTextarea';
import TipCard from '../components/ui/TipCard';
import NavigationButtons from '../components/ui/NavigationButtons';
import { useResume } from '../context/ResumeContext';
import { professionalSummarySchema } from '../schema/validation';

const EXAMPLE_SUMMARIES = [
  {
    role: 'Full Stack Developer',
    text: 'Passionate Full Stack Developer with expertise in React, Node.js and modern web technologies. Dedicated to writing clean, scalable code and delivering exceptional user experiences.',
  },
  {
    role: 'Product / Project Manager',
    text: 'Results-driven Product Manager with 4+ years of experience leading cross-functional teams from product ideation to global scale. Skilled in Agile sprints, user research, and data analytics.',
  },
  {
    role: 'Data Scientist / Analyst',
    text: 'Analytical Data Scientist experienced in Python, SQL, and predictive machine learning models. Proven ability to translate complex data into business revenue growth.',
  },
];

const ProfessionalSummary = ({ onNext, onPrevious }) => {
  const { resumeData, updateSummary } = useResume();
  const summaryValue = resumeData.professionalSummary || resumeData.summary || '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(professionalSummarySchema),
    defaultValues: {
      professionalSummary: summaryValue,
    },
    mode: 'onChange',
  });

  const currentSummary = watch('professionalSummary') || '';

  // Synchronize changes in real time with Zustand store for instant live preview
  useEffect(() => {
    const subscription = watch((values) => {
      updateSummary(values.professionalSummary || '');
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSummary]);

  const onValidSubmit = (data) => {
    updateSummary(data.professionalSummary || '');
    onNext();
  };

  const handlePreviousClick = () => {
    updateSummary(currentSummary);
    onPrevious();
  };

  const handleApplyExample = (text) => {
    setValue('professionalSummary', text, { shouldValidate: true, shouldDirty: true });
    updateSummary(text);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-6">
      <FormCard
        title="Professional Summary"
        subtitle="A compelling summary helps recruiters quickly understand your value."
        icon={FileText}
      >
        <FormTextarea
          id="professionalSummary"
          value={currentSummary}
          maxLength={450}
          rows={6}
          placeholder="e.g. Passionate Full Stack Developer with expertise in React, Node.js and modern web technologies..."
          error={errors.professionalSummary?.message}
          {...register('professionalSummary')}
        />

        {/* Quick Example Suggestions */}
        <div className="mt-6 pt-5 border-t border-border-subtle">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <h4 className="text-xs font-bold text-heading uppercase tracking-wider">
              Example Summaries (Click to Use)
            </h4>
          </div>
          <div className="space-y-2.5">
            {EXAMPLE_SUMMARIES.map((example, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyExample(example.text)}
                className="group p-3 rounded-xl bg-surface-50 hover:bg-primary-50/60 border border-border-light hover:border-primary-300 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-primary-700">{example.role}</span>
                  <span className="text-[11px] font-semibold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Check className="w-3 h-3" /> Apply
                  </span>
                </div>
                <p className="text-xs text-body line-clamp-2 leading-relaxed">
                  "{example.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </FormCard>

      {/* Tip Card */}
      <TipCard
        title="Tip"
        tips={[
          'Keep it concise (2-3 lines) and highlight your key skills and experience.',
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

export default ProfessionalSummary;
