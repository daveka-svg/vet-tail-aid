import { useFormContext } from "@/contexts/FormContext";
import { Check } from "lucide-react";

const FormStepper = () => {
  const { steps, currentStep, setCurrentStep } = useFormContext();

  return (
    <>
      {/* Desktop sidebar stepper */}
      <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-card border-r border-border p-8 pt-10 sticky top-0">
        <div className="mb-10">
          <h2 className="text-xl font-bold">AHC Form</h2>
          <p className="text-xs text-muted-foreground mt-1">Pre-Appointment Intake</p>
        </div>
        <nav className="flex-1">
          <ol className="space-y-1">
            {steps.map((step, idx) => {
              const isActive = idx === currentStep;
              const isComplete = idx < currentStep;
              return (
                <li key={step.id}>
                  <button
                    onClick={() => idx < currentStep && setCurrentStep(idx)}
                    className={`flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-left text-sm transition-all ${
                      isActive ? "bg-secondary font-semibold" : isComplete ? "cursor-pointer hover:bg-secondary/50" : "opacity-50 cursor-default"
                    }`}
                    disabled={idx > currentStep}
                  >
                    <span className={`step-circle ${isActive ? "step-circle-active" : isComplete ? "step-circle-complete" : "step-circle-inactive"}`}>
                      {isComplete ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <span className="truncate">{step.shortTitle}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      {/* Mobile top progress */}
      <div className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs font-semibold">{steps[currentStep]?.title}</span>
        </div>
        <div className="flex gap-1">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx < currentStep ? "bg-primary" : idx === currentStep ? "bg-primary" : "bg-muted"
              }`}
              style={{ opacity: idx === currentStep ? 0.7 : idx < currentStep ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FormStepper;
