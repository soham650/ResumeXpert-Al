import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, MapPin, Link, Github, Globe, Plus, Linkedin, Trash2 } from 'lucide-react';
import FormCard from '../components/ui/FormCard';
import FormInput from '../components/ui/FormInput';
import TipCard from '../components/ui/TipCard';
import NavigationButtons from '../components/ui/NavigationButtons';
import { useResume } from '../context/ResumeContext';
import { personalInfoSchema } from '../schema/validation';

const PersonalInfo = ({ onNext, onPrevious }) => {
  const { resumeData, updateBasics } = useResume();
  const personalInfo = resumeData.personalInfo || resumeData.basics || {};

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: personalInfo.fullName || '',
      professionalTitle: personalInfo.professionalTitle || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      location: personalInfo.location || '',
      linkedinUrl: personalInfo.linkedinUrl || '',
      githubUrl: personalInfo.githubUrl || '',
      portfolioUrl: personalInfo.portfolioUrl || '',
      additionalLinks: personalInfo.additionalLinks || [],
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalLinks',
  });

  // Real-time synchronization to Zustand store for instant live preview updates
  useEffect(() => {
    const subscription = watch((values) => {
      updateBasics(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBasics]);

  const onValidSubmit = (data) => {
    updateBasics(data);
    onNext();
  };

  const handlePreviousClick = () => {
    const values = watch();
    updateBasics(values);
    onPrevious();
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-6">
      {/* Basic Contact Details Card */}
      <FormCard
        title="Personal Information"
        subtitle="Let's start with your basic details"
        icon={User}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="Full Name"
            placeholder="e.g. John Doe"
            required
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <FormInput
            label="Professional Title"
            placeholder="e.g. Full Stack Developer"
            error={errors.professionalTitle?.message}
            {...register('professionalTitle')}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="e.g. john@example.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />
          <FormInput
            label="Phone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div className="sm:col-span-2">
            <FormInput
              label="Location"
              placeholder="e.g. Nagpur, India"
              error={errors.location?.message}
              {...register('location')}
            />
          </div>
        </div>

        {/* Links Section */}
        <div className="mt-6 pt-5 border-t border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-heading">Online Profiles & Links</h3>
              <p className="text-xs text-body">Add your professional links for recruiters</p>
            </div>
            <button
              type="button"
              onClick={() => append({ label: 'LinkedIn', url: '' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-light hover:border-primary-400 bg-white hover:bg-primary-50 text-xs font-semibold text-primary-600 transition-all shadow-subtle active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-3">
            <FormInput
              label="LinkedIn Profile"
              placeholder="e.g. linkedin.com/in/johndoe"
              icon={Linkedin}
              error={errors.linkedinUrl?.message}
              {...register('linkedinUrl')}
            />

            <FormInput
              label="GitHub Profile"
              placeholder="e.g. github.com/johndoe"
              icon={Github}
              error={errors.githubUrl?.message}
              {...register('githubUrl')}
            />

            <FormInput
              label="Portfolio / Website"
              placeholder="e.g. https://johndoe.dev"
              icon={Globe}
              error={errors.portfolioUrl?.message}
              {...register('portfolioUrl')}
            />

            {/* Custom Additional Links */}
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-1.5 p-3 rounded-xl bg-surface-50 border border-border-light animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <input
                    type="text"
                    placeholder="Platform (e.g. Medium, X, Kaggle)"
                    className="w-1/3 px-3 py-2 rounded-lg border border-border-light bg-white text-xs text-heading font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                    {...register(`additionalLinks.${index}.label`)}
                  />
                  <input
                    type="text"
                    placeholder="URL (e.g. https://...)"
                    className="flex-1 px-3 py-2 rounded-lg border border-border-light bg-white text-xs text-heading focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                    {...register(`additionalLinks.${index}.url`)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-body hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {errors.additionalLinks?.[index]?.url && (
                  <p className="text-xs font-semibold text-rose-500 pl-1" role="alert">
                    {errors.additionalLinks[index].url.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </FormCard>

      {/* Tip Card */}
      <TipCard
        title="Tip"
        tips={[
          'Include a professional email address and current location to pass recruiter filters.',
          'Adding a LinkedIn and portfolio URL increases ATS profile match rate by up to 35%.',
        ]}
      />

      {/* Navigation Buttons */}
      <NavigationButtons
        isFirstStep={true}
        onPrevious={handlePreviousClick}
        onNext={handleSubmit(onValidSubmit)}
      />
    </form>
  );
};

export default PersonalInfo;
