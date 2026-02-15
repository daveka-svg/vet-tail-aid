import { useFormContext } from "@/contexts/FormContext";
import logo from "@/assets/logo.png";
import yarnBall from "@/assets/yarn-ball.svg";
import catPlaying from "@/assets/cat-playing.svg";

const FormStepper = () => {
  const { steps, currentStep, isSubmitted } = useFormContext();
  const progress = steps.length > 1 ? currentStep / (steps.length - 1) : 0;

  if (isSubmitted) return null;

  return (
    <header className="w-full bg-background relative">
      {/* Top bar: logo + page title + cat */}
      <div className="relative flex items-center px-8 md:px-16 pt-6 pb-3">
        {/* Logo — left */}
        <img
          src={logo}
          alt="Every Tail Vets"
          className="h-8 md:h-10 object-contain flex-shrink-0 relative z-10"
        />

        {/* Title — centered absolutely */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1
            className="text-3xl md:text-[2.8rem] text-primary leading-none"
            style={{ fontFamily: "'That That New', Georgia, serif", fontWeight: 400 }}
          >
            AHC Pre-Appointment Form
          </h1>
        </div>

        {/* Cat illustration — right */}
        <div className="ml-auto flex-shrink-0 relative z-10">
          <img
            src={catPlaying}
            alt=""
            className="h-16 md:h-24 object-contain"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mx-8 md:mx-16 h-12 flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-border" />
        {/* Filled */}
        <div
          className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 transition-all duration-500 ease-out"
          style={{
            width: `${Math.max(progress * 100, 1)}%`,
            backgroundColor: 'hsl(var(--primary))',
          }}
        />
        {/* Yarn ball */}
        <div
          className="absolute top-1/2 z-10 transition-all duration-500 ease-out"
          style={{
            left: `${progress * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img src={yarnBall} alt="" className="w-10 h-10 md:w-11 md:h-11" />
        </div>
      </div>
    </header>
  );
};

export default FormStepper;
