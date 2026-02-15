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
        
        {/* Dog illustrations - decorative, bottom-left */}
        <div className="hidden lg:block fixed left-0 bottom-0 pointer-events-none select-none z-0">
          <img src={dogDalmatian} alt="" className="w-44 xl:w-56 absolute bottom-4 left-8" />
          <img src={dogBandana} alt="" className="w-24 xl:w-32 absolute bottom-28 left-2" />
        </div>

        <main className="flex-1 flex justify-center relative z-10">
          <div className="w-full max-w-2xl px-5 md:px-10 py-8 md:py-12">
            <FormContent />
          </div>
        </main>
      </div>
    </FormProvider>
  );
};

export default Index;
