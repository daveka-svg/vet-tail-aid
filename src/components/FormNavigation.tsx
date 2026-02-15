import { useFormContext } from "@/contexts/FormContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className="flex items-center justify-between pt-10 pb-6">
      {!hideBack && currentStep > 0 ? (
        <button onClick={handleBack} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      ) : <div />}
      {!hideNext && (
        <button onClick={handleNext} className="btn-primary flex items-center gap-2">
          {nextLabel || "Continue"} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
