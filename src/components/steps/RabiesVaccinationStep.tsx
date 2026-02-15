import FormField from "@/components/FormField";
import FormNavigation from "@/components/FormNavigation";
import { useFormContext } from "@/contexts/FormContext";

const RabiesVaccinationStep = () => {
  const { formData, setErrors } = useFormContext();
  const r = formData.rabies;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!r.vaccinationDate) e["rabies.vaccinationDate"] = "Required";
    if (!r.vaccineName.trim()) e["rabies.vaccineName"] = "Required";
    if (!r.manufacturer.trim()) e["rabies.manufacturer"] = "Required";
    if (!r.batchNumber.trim()) e["rabies.batchNumber"] = "Required";
    if (!r.validFrom) e["rabies.validFrom"] = "Required";
    if (!r.validTo) e["rabies.validTo"] = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Rabies Vaccination</h1>

      <FormField section="rabies" field="vaccinationDate" label="Date of Rabies Vaccination" required type="date" />
      <FormField section="rabies" field="vaccineName" label="Vaccine Name" required placeholder="e.g. Nobivac Rabies" />
      <FormField section="rabies" field="manufacturer" label="Manufacturer" required placeholder="Vaccine manufacturer" />
      <FormField section="rabies" field="batchNumber" label="Batch Number" required placeholder="Batch number" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <FormField section="rabies" field="validFrom" label="Validity FROM" required type="date" />
        <FormField section="rabies" field="validTo" label="Validity TO" required type="date" />
      </div>

      <FormNavigation onNext={validate} />
    </div>
  );
};

export default RabiesVaccinationStep;
