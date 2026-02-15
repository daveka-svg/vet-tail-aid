import { useFormContext } from "@/contexts/FormContext";
import logo from "@/assets/logo.png";

const FormStepper = () => {
  const { steps, currentStep, isSubmitted } = useFormContext();

  if (isSubmitted) return null;

  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-5 pb-3">
        {/* Logo + title row */}
        <div className="flex items-center gap-4 mb-4">
          <img src={logo} alt="Every Tail Vets" className="h-10 md:h-12 object-contain" />
          <div className="flex-1">
            <h1 className="text-base md:text-lg font-semibold text-foreground leading-tight">
              AHC Pre-Appointment Form
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Step {currentStep + 1} of {steps.length} — {steps[currentStep]?.title}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
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
