import { useFormContext } from "@/contexts/FormContext";
import logo from "@/assets/logo.png";
import yarnBall from "@/assets/yarn-ball.svg";
import catPlaying from "@/assets/cat-playing.svg";

const FormStepper = () => {
  const { steps, currentStep } = useFormContext();
  const progress = steps.length > 1 ? currentStep / (steps.length - 1) : 0;

  return (
    <header className="w-full bg-background">
      {/* Top row: logo, title, cat */}
      <div className="flex items-start justify-between px-6 md:px-12 pt-5 pb-2">
        <img src={logo} alt="Every Tail Vets" className="h-7 md:h-9 object-contain flex-shrink-0" />
        <h1
          className="text-3xl md:text-5xl text-center flex-1 px-6 text-primary"
          style={{ fontFamily: "'That That New', Georgia, serif", fontWeight: 400, lineHeight: 1.1 }}
        >
          AHC Pre-Appointment Form
        </h1>
        <img src={catPlaying} alt="" className="h-20 md:h-28 object-contain flex-shrink-0 -mt-2 hidden sm:block" />
      </div>

      {/* Progress bar — thin line spanning full width with yarn ball on it */}
      <div className="relative px-6 md:px-12 mt-1 mb-2">
        <div className="relative h-10 flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-border" />
          {/* Filled track */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress * 100, 2)}%` }}
          />
          {/* Yarn ball sits ON the line */}
          <div
            className="absolute top-1/2 transition-all duration-500 ease-out z-10"
            style={{ left: `${progress * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <img src={yarnBall} alt="" className="w-10 h-10 md:w-12 md:h-12" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default FormStepper;
