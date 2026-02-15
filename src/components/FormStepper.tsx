import { useFormContext } from "@/contexts/FormContext";
import logo from "@/assets/logo.png";

const FormStepper = () => {
  const { steps, currentStep } = useFormContext();

  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <img src={logo} alt="Every Tail Vets" className="h-8 object-contain" />
          <div className="flex-1 text-right">
            <p className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {steps.length} — {steps[currentStep]?.title}
            </p>
          </div>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default FormStepper;
