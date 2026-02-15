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
    <div className="flex items-center justify-between pt-8 pb-4 md:sticky md:relative fixed bottom-0 left-0 right-0 bg-background md:bg-transparent px-6 md:px-0 py-4 md:py-0 border-t md:border-t-0 border-border z-20">
      <div>
        {!hideBack && currentStep > 0 && (
          <button onClick={handleBack} className="btn-secondary">
            ← Back
          </button>
        )}
      </div>
      <div>
        {!hideNext && (
          <button onClick={handleNext} className="btn-primary">
            {nextLabel || "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
