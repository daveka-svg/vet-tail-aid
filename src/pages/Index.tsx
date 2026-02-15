import { FormProvider, useFormContext } from "@/contexts/FormContext";
import FormStepper from "@/components/FormStepper";
import IntroStep from "@/components/steps/IntroStep";
import OwnerDetailsStep from "@/components/steps/OwnerDetailsStep";
import PetTransportStep from "@/components/steps/PetTransportStep";
import AuthorisedPersonStep from "@/components/steps/AuthorisedPersonStep";
import PetInfoStep from "@/components/steps/PetInfoStep";
import TravelInfoStep from "@/components/steps/TravelInfoStep";
import RabiesVaccinationStep from "@/components/steps/RabiesVaccinationStep";
import UploadDocumentsStep from "@/components/steps/UploadDocumentsStep";
import DeclarationStep from "@/components/steps/DeclarationStep";
import ReviewStep from "@/components/steps/ReviewStep";
import ConfirmationStep from "@/components/steps/ConfirmationStep";
import dogBandana from "@/assets/dog-bandana.png";
import dogDalmatian from "@/assets/dog-dalmatian.png";
import catRunning from "@/assets/cat-running.png";

const STEP_COMPONENTS: Record<string, React.FC> = {
  intro: IntroStep,
  owner: OwnerDetailsStep,
  transport: PetTransportStep,
  authorised: AuthorisedPersonStep,
  pet: PetInfoStep,
  travel: TravelInfoStep,
  rabies: RabiesVaccinationStep,
  uploads: UploadDocumentsStep,
  declaration: DeclarationStep,
  review: ReviewStep,
  confirmation: ConfirmationStep,
};

const FormContent = () => {
  const { steps, currentStep, isSubmitted } = useFormContext();

  if (isSubmitted) return <ConfirmationStep />;

  const currentStepConfig = steps[currentStep];
  if (!currentStepConfig) return null;

  const StepComponent = STEP_COMPONENTS[currentStepConfig.id];
  if (!StepComponent) return null;

  return <StepComponent />;
};

const Index = () => {
  return (
    <FormProvider>
      <div className="min-h-screen bg-background flex flex-col relative">
        <FormStepper />

        <main className="flex-1 flex justify-center relative z-10">
          <div className="w-full max-w-xl px-6 md:px-8 py-8 md:py-12">
            <FormContent />
          </div>
        </main>

        {/* Decorative illustrations — only on wide screens, won't overlap content */}
        <img
          src={dogDalmatian}
          alt=""
          className="hidden 2xl:block fixed bottom-6 left-12 w-48 pointer-events-none select-none z-0 opacity-80"
        />
        <img
          src={dogBandana}
          alt=""
          className="hidden 2xl:block fixed bottom-36 left-2 w-24 pointer-events-none select-none z-0 opacity-50"
        />
        <img
          src={catRunning}
          alt=""
          className="hidden 2xl:block fixed bottom-6 right-10 w-20 pointer-events-none select-none z-0 opacity-50"
        />
      </div>
    </FormProvider>
  );
};

export default Index;
