import FormNavigation from "@/components/FormNavigation";
import FormField from "@/components/FormField";
import { useFormContext } from "@/contexts/FormContext";

const DECLARATION_TEXT = `I declare that the information entered in this Pre-Appointment Form for the Animal Health Certificate (AHC) is accurate and correct and can be used by an Official Veterinarian to complete an AHC. Before booking, I have read the AHC Requirements and confirm that the pet(s) meet(s) the eligibility criteria for obtaining an AHC. I understand that any errors could invalidate the AHC and that the AHC is valid for entry to the EU for up to ten days from its date of issue, and for up to four months (120 days) for onward travel within the EU and/or for re-entry to Great Britain. Therefore, if the pet(s) will be returning within this timeframe, it is essential to ensure that the AHC will still be valid upon re-entry.`;

const DeclarationStep = () => {
  const { formData, updateField, setErrors } = useFormContext();
  const d = formData.declaration;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!d.agreed) e["declaration.agreed"] = "You must agree to the declaration";
    if (!d.signature.trim()) e["declaration.signature"] = "Signature is required";
    if (!d.date) e["declaration.date"] = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Declaration & Signature</h1>

      <div className="bg-card border border-border rounded-lg p-5 mb-6 text-sm leading-relaxed">
        {DECLARATION_TEXT}
      </div>

      <div className="mb-6">
        <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
          d.agreed ? "border-primary bg-secondary" : "border-border bg-card"
        }`}>
          <input
            type="checkbox"
            checked={d.agreed}
            onChange={(e) => updateField("declaration", "agreed", e.target.checked)}
            className="accent-primary w-4 h-4 mt-0.5"
          />
          <span className="text-sm">I agree to the above declaration <span className="text-destructive">*</span></span>
        </label>
      </div>

      <FormField section="declaration" field="signature" label="Typed Signature" required placeholder="Type your full name as signature" />
      <FormField section="declaration" field="date" label="Date" required type="date" />

      <FormNavigation onNext={validate} nextLabel="Review & Submit" />
    </div>
  );
};

export default DeclarationStep;
