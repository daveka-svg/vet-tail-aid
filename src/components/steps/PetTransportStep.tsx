import FormNavigation from "@/components/FormNavigation";
import FormField from "@/components/FormField";
import { useFormContext } from "@/contexts/FormContext";
import { AlertTriangle } from "lucide-react";

const PetTransportStep = () => {
  const { formData, updateField, errors, setErrors } = useFormContext();
  const tb = formData.transport.transportedBy;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!tb) e["transport.transportedBy"] = "Please select who will transport the pet";
    if (tb === "carrier" && !formData.transport.carrierName.trim()) e["transport.carrierName"] = "Carrier name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const options = [
    { value: "owner", label: "Owner" },
    { value: "authorised", label: "Authorised Person" },
    { value: "carrier", label: "Carrier (Pet Transport Company)" },
  ] as const;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Pet Transport</h1>
      <p className="text-sm text-muted-foreground mb-6">Who will be transporting the pet?</p>

      <div className="space-y-3 mb-6">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
              tb === opt.value ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <input
              type="radio"
              name="transportedBy"
              value={opt.value}
              checked={tb === opt.value}
              onChange={() => updateField("transport", "transportedBy", opt.value)}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      {errors["transport.transportedBy"] && <p className="form-error mb-4">{errors["transport.transportedBy"]}</p>}

      {tb === "carrier" && (
        <FormField section="transport" field="carrierName" label="Name of Carrier" required placeholder="Transport company name" />
      )}

      {(tb === "authorised" || tb === "carrier") && (
        <div className="reminder-box flex gap-3 items-start mb-4">
          <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            A letter of authorisation must be brought to the appointment. 
            The person travelling with the pet must attend the appointment.
          </p>
        </div>
      )}

      <FormNavigation onNext={validate} />
    </div>
  );
};

export default PetTransportStep;
