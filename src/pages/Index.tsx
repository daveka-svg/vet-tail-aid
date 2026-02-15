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
import ConfirmationStep from "@/components/steps/ConfirmationStep";

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
  confirmation: ConfirmationStep,
};

const FormContent = () => {
  const { steps, currentStep, isSubmitted } = useFormContext();

  // If submitted, always show confirmation
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
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <FormStepper />
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl px-5 md:px-10 py-8 md:py-12">
            <FormContent />
          </div>
        </main>
      </div>
    </FormProvider>
  );
};

export default Index;
