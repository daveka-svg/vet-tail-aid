import { useFormContext } from "@/contexts/FormContext";

interface Props {
  onNext?: () => boolean;
  nextLabel?: string;
  hideBack?: boolean;
  hideNext?: boolean;
}

const FormNavigation = ({ onNext, nextLabel, hideBack, hideNext }: Props) => {
  const { currentStep, setCurrentStep, steps } = useFormContext();

  const handleNext = () => {
    if (onNext) {
      const valid = onNext();
      if (!valid) return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center justify-end pt-8 pb-4 gap-3">
      {!hideBack && currentStep > 0 && (
        <button
          onClick={handleBack}
          className="px-6 py-2 border border-gray-400 rounded text-sm text-black hover:bg-gray-100"
        >
          Back
        </button>
      )}
      {!hideNext && (
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
        >
          {nextLabel || "Continue →"}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
