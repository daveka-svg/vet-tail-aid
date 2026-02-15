import { useFormContext } from "@/contexts/FormContext";
import logo from "@/assets/logo.png";
import yarnBall from "@/assets/yarn-ball.svg";
import catPlaying from "@/assets/cat-playing.svg";

const FormStepper = () => {
  const { steps, currentStep } = useFormContext();

  // Calculate progress: how far through the steps we are
  const progress = steps.length > 1 ? currentStep / (steps.length - 1) : 0;

  return (
    <header className="w-full bg-background pt-6 pb-4 px-6 md:px-10">
      {/* Top row: logo + title + cat illustration */}
      <div className="flex items-start justify-between mb-4">
        <img src={logo} alt="Every Tail Vets" className="h-8 md:h-10 object-contain" />
        <h1 className="text-2xl md:text-4xl text-center flex-1 px-4" style={{ fontFamily: "'That That New', Georgia, serif" }}>
          AHC Pre-Appointment Form
        </h1>
        <img src={catPlaying} alt="" className="h-16 md:h-24 object-contain hidden md:block" />
      </div>

      {/* Progress bar with yarn ball */}
      <div className="relative mx-auto max-w-3xl">
        {/* Track line */}
        <div className="h-[2px] w-full rounded-full" style={{ backgroundColor: 'hsl(var(--border))' }} />
        
        {/* Filled portion */}
        <div
          className="absolute top-0 left-0 h-[2px] rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: 'hsl(var(--primary))',
          }}
        />

        {/* Yarn ball indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ left: `${progress * 100}%`, transform: `translate(-50%, -50%)` }}
        >
          <img src={yarnBall} alt="" className="w-8 h-8 md:w-10 md:h-10" />
        </div>
      </div>

      {/* Step label */}
      <div className="text-center mt-3">
        <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Sometype Mono', monospace" }}>
          Step {currentStep + 1} of {steps.length} — {steps[currentStep]?.title}
        </span>
      </div>
    </header>
  );
};

export default FormStepper;
