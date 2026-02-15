import FormField from "@/components/FormField";
import FormNavigation from "@/components/FormNavigation";
import { useFormContext } from "@/contexts/FormContext";
import { Info } from "lucide-react";

const TravelInfoStep = () => {
  const { formData, updateField, errors, setErrors } = useFormContext();
  const t = formData.travel;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!t.meansOfTravel) e["travel.meansOfTravel"] = "Please select";
    if (!t.dateOfEntry) e["travel.dateOfEntry"] = "Date is required";
    if (!t.firstCountry.trim()) e["travel.firstCountry"] = "Required";
    if (!t.finalCountry.trim()) e["travel.finalCountry"] = "Required";
    if (!t.tapewormRequired) e["travel.tapewormRequired"] = "Please select";
    if (!t.returningWithinFiveDays) e["travel.returningWithinFiveDays"] = "Please select";
    if (!t.returningWithin120Days) e["travel.returningWithin120Days"] = "Please select";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const RadioGroup = ({ field, options }: { field: string; options: { value: string; label: string }[] }) => (
    <div className="flex gap-4 mt-1">
      {options.map(opt => (
        <label key={opt.value} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
          (t as any)[field] === opt.value ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"
        }`}>
          <input type="radio" name={field} value={opt.value} checked={(t as any)[field] === opt.value}
            onChange={() => updateField("travel", field, opt.value)} className="accent-primary w-3.5 h-3.5" />
          {opt.label}
        </label>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Travel Information</h1>

      <div className="mb-5">
        <label className="form-label">Means of Travel <span className="text-destructive">*</span></label>
        <RadioGroup field="meansOfTravel" options={[{ value: "car_ferry", label: "Car / Ferry" }, { value: "air", label: "Air" }]} />
        {errors["travel.meansOfTravel"] && <p className="form-error">{errors["travel.meansOfTravel"]}</p>}
      </div>

      {t.meansOfTravel === "air" && (
        <div className="reminder-box flex gap-3 items-start mb-6">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm">If flying by air, please check with the airline company if any further documentation is needed.</p>
        </div>
      )}

      <FormField section="travel" field="dateOfEntry" label="Date of Entry to the EU" required type="date" />

      <div className="reminder-box mb-6 text-xs">
        You must obtain an AHC within 10 days before entering the EU if your pet has an up-to-date rabies vaccination or only needs booster doses.
      </div>

      <FormField section="travel" field="firstCountry" label="First Country of Entry into the EU" required placeholder="e.g. France, Ireland" helper="The first country you arrive in when reaching the EU from the UK" />
      <FormField section="travel" field="finalCountry" label="Final Destination Country" required placeholder="e.g. Spain, Italy" />

      <div className="mb-5">
        <label className="form-label">Entering via Northern Ireland, Republic of Ireland, Finland, Malta or Norway? (tapeworm treatment needed) <span className="text-destructive">*</span></label>
        <RadioGroup field="tapewormRequired" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
        {errors["travel.tapewormRequired"] && <p className="form-error">{errors["travel.tapewormRequired"]}</p>}
      </div>

      <div className="mb-5">
        <label className="form-label">Returning with the dog(s) from the EU within 5 days? <span className="text-destructive">*</span></label>
        <RadioGroup field="returningWithinFiveDays" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
        {errors["travel.returningWithinFiveDays"] && <p className="form-error">{errors["travel.returningWithinFiveDays"]}</p>}
      </div>

      <div className="mb-5">
        <label className="form-label">Will the pet(s) be returning to the UK within 120 days? <span className="text-destructive">*</span></label>
        <RadioGroup field="returningWithin120Days" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
        {errors["travel.returningWithin120Days"] && <p className="form-error">{errors["travel.returningWithin120Days"]}</p>}
      </div>

      <FormNavigation onNext={validate} />
    </div>
  );
};

export default TravelInfoStep;
