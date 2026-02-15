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

  if (isSubmitted) {
    return <ConfirmationStep />;
  }

  const currentStepConfig = steps[currentStep];
  if (!currentStepConfig) return null;

  const StepComponent = STEP_COMPONENTS[currentStepConfig.id];
  if (!StepComponent) return null;

  return <StepComponent />;
};

const Index = () => {
  return (
    <FormProvider>
      <div className="min-h-screen bg-background flex flex-col relative overflow-x-hidden">
        <FormStepper />

        {/* Decorative illustrations — dogs bottom-left, cat bottom-right */}
        <div className="hidden xl:block fixed bottom-0 left-0 pointer-events-none select-none z-0" style={{ width: '280px' }}>
          <img src={dogDalmatian} alt="" className="w-48 absolute bottom-6 left-10 opacity-90" />
          <img src={dogBandana} alt="" className="w-24 absolute bottom-36 left-0 opacity-60" />
        </div>
        <div className="hidden xl:block fixed bottom-4 right-6 pointer-events-none select-none z-0">
          <img src={catRunning} alt="" className="w-24 opacity-60" />
        </div>

        <main className="flex-1 flex justify-center relative z-10">
          <div className="w-full max-w-xl px-5 md:px-8 py-6 md:py-10">
            <FormContent />
          </div>
        </main>
      </div>
    </FormProvider>
  );
};

export default Index;
