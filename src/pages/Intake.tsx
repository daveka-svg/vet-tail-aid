import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import logo from "@/assets/logo.png";

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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const IntakeFormContent = ({ token }: { token: string }) => {
  const { steps, currentStep, isSubmitted, formData } = useFormContext();
  const [submissionLoaded, setSubmissionLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Load submission by token via edge function
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/intake-api/${token}`);
        if (!res.ok) {
          setLoadError("Invalid or expired link.");
          return;
        }
        const data = await res.json();
        if (data.error) {
          setLoadError(data.error);
          return;
        }
        setSubmissionLoaded(true);
      } catch {
        setLoadError("Failed to load submission.");
      }
    };
    load();
  }, [token]);

  // Auto-save to DB on form data changes (debounced via edge function)
  useEffect(() => {
    if (!submissionLoaded) return;
    const timeout = setTimeout(async () => {
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/intake-api/${token}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data_json: formData }),
        });
      } catch {}
    }, 3000);
    return () => clearTimeout(timeout);
  }, [formData, submissionLoaded, token]);

  // On final submit
  useEffect(() => {
    if (isSubmitted && submissionLoaded) {
      fetch(`${SUPABASE_URL}/functions/v1/intake-api/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data_json: formData }),
      }).catch(() => {});
    }
  }, [isSubmitted, submissionLoaded, token]);

  if (loadError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="w-full border-b border-border bg-background">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center">
            <img src={logo} alt="Every Tail Vets" className="h-8 object-contain" />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">{loadError}</p>
        </main>
      </div>
    );
  }

  if (!submissionLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isSubmitted) return <ConfirmationStep />;

  const currentStepConfig = steps[currentStep];
  if (!currentStepConfig) return null;
  const StepComponent = STEP_COMPONENTS[currentStepConfig.id];
  if (!StepComponent) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FormStepper />
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 py-8">
          <StepComponent />
        </div>
      </main>
    </div>
  );
};

const Intake = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) return <p className="text-sm text-muted-foreground p-6">No token provided.</p>;

  return (
    <FormProvider>
      <IntakeFormContent token={token} />
    </FormProvider>
  );
};

export default Intake;
