import FormNavigation from "@/components/FormNavigation";
import FormField from "@/components/FormField";
import { useFormContext } from "@/contexts/FormContext";
import { useState } from "react";

const DECLARATION_TEXT = `I declare that the information entered in this Pre-Appointment Form for the Animal Health Certificate (AHC) is accurate and correct and can be used by an Official Veterinarian to complete an AHC. Before booking, I have read the AHC Requirements and confirm that the pet(s) meet(s) the eligibility criteria for obtaining an AHC. I understand that any errors could invalidate the AHC and that the AHC is valid for entry to the EU for up to ten days from its date of issue, and for up to four months (120 days) for onward travel within the EU and/or for re-entry to Great Britain. Therefore, if the pet(s) will be returning within this timeframe, it is essential to ensure that the AHC will still be valid upon re-entry.`;

const DeclarationStep = () => {
  const { formData, updateField, setErrors, setCurrentStep, setIsSubmitted, steps } = useFormContext();
  const [showReview, setShowReview] = useState(false);
  const d = formData.declaration;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!d.agreed) e["declaration.agreed"] = "You must agree to the declaration";
    if (!d.signature.trim()) e["declaration.signature"] = "Signature is required";
    if (!d.printName.trim()) e["declaration.printName"] = "Print name is required";
    if (!d.date) e["declaration.date"] = "Date is required";
    setErrors(e);
    if (Object.keys(e).length > 0) return false;
    setShowReview(true);
    return false; // prevent auto-advance, we show review first
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setCurrentStep(steps.length - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    value ? <div className="flex justify-between py-1.5 border-b border-border/50 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div> : null
  );

  if (showReview) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Review & Submit</h1>
        <p className="text-sm text-muted-foreground mb-6">Please review your information before submitting.</p>

        <div className="summary-section">
          <div className="flex justify-between items-center mb-3">
            <h3 className="form-section-title mb-0">Owner</h3>
            <button onClick={() => { setShowReview(false); setCurrentStep(1); }} className="text-xs text-primary underline">Edit</button>
          </div>
          <SummaryRow label="Name" value={`${formData.owner.firstName} ${formData.owner.lastName}`} />
          <SummaryRow label="Address" value={`${formData.owner.houseNameNumber} ${formData.owner.street}, ${formData.owner.townCity}, ${formData.owner.postalCode}`} />
          <SummaryRow label="Phone" value={formData.owner.phone} />
          <SummaryRow label="Email" value={formData.owner.email} />
        </div>

        <div className="summary-section">
          <div className="flex justify-between items-center mb-3">
            <h3 className="form-section-title mb-0">Pet</h3>
          </div>
          <SummaryRow label="Name" value={formData.pet.name} />
          <SummaryRow label="Species / Breed" value={`${formData.pet.species} — ${formData.pet.breed}`} />
          <SummaryRow label="Microchip" value={formData.pet.microchipNumber} />
        </div>

        <div className="summary-section">
          <div className="flex justify-between items-center mb-3">
            <h3 className="form-section-title mb-0">Travel</h3>
          </div>
          <SummaryRow label="Means" value={formData.travel.meansOfTravel === "car_ferry" ? "Car / Ferry" : "Air"} />
          <SummaryRow label="Entry Date" value={formData.travel.dateOfEntry} />
          <SummaryRow label="First Country" value={formData.travel.firstCountry} />
          <SummaryRow label="Final Destination" value={formData.travel.finalCountry} />
        </div>

        <div className="summary-section">
          <div className="flex justify-between items-center mb-3">
            <h3 className="form-section-title mb-0">Rabies</h3>
          </div>
          <SummaryRow label="Vaccine" value={formData.rabies.vaccineName} />
          <SummaryRow label="Date" value={formData.rabies.vaccinationDate} />
          <SummaryRow label="Valid" value={`${formData.rabies.validFrom} to ${formData.rabies.validTo}`} />
        </div>

        <div className="flex gap-4 pt-6 pb-6">
          <button onClick={() => setShowReview(false)} className="btn-secondary">Back to Declaration</button>
          <button onClick={handleSubmit} className="btn-primary">Submit Form</button>
        </div>
      </div>
    );
  }

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
        {formData.declaration.agreed === false && <p className="form-error">{}</p>}
      </div>

      <FormField section="declaration" field="signature" label="Typed Signature" required placeholder="Type your full name as signature" />
      <FormField section="declaration" field="printName" label="Print Name" required placeholder="Print your full name" />
      <FormField section="declaration" field="date" label="Date" required type="date" />

      <FormNavigation onNext={validate} nextLabel="Review & Submit" />
    </div>
  );
};

export default DeclarationStep;
