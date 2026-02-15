import { useFormContext } from "@/contexts/FormContext";

const FormStepper = () => {
  const { steps, currentStep, isSubmitted } = useFormContext();

  if (isSubmitted) return null;

  return (
    <header className="w-full border-b border-gray-300 bg-white">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <h1 className="text-xl font-bold text-black mb-1">AHC Pre-Appointment Form</h1>
        <p className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
        </p>
      </div>
      <div className="max-w-2xl mx-auto px-6 pb-4">
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-black rounded transition-all duration-300"
            style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default FormStepper;
