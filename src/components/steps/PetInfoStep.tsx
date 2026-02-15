import FormField from "@/components/FormField";
import FormNavigation from "@/components/FormNavigation";
import { useFormContext } from "@/contexts/FormContext";

const PetInfoStep = () => {
  const { formData, updateField, errors, setErrors } = useFormContext();
  const p = formData.pet;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!p.name.trim()) e["pet.name"] = "Pet name is required";
    if (!p.species.trim()) e["pet.species"] = "Species is required";
    if (!p.breed.trim()) e["pet.breed"] = "Breed is required";
    if (!p.dateOfBirth.trim()) e["pet.dateOfBirth"] = "Date of birth is required";
    if (!p.colour.trim()) e["pet.colour"] = "Colour is required";
    if (!p.sex) e["pet.sex"] = "Sex is required";
    if (!p.neutered) e["pet.neutered"] = "Please select";
    if (!p.microchipNumber.trim()) e["pet.microchipNumber"] = "Microchip number is required";
    else if (!/^\d{15}$/.test(p.microchipNumber)) e["pet.microchipNumber"] = "Must be exactly 15 digits";
    if (!p.microchipDate.trim()) e["pet.microchipDate"] = "Implantation date is required";
    if (!p.routineVaccines) e["pet.routineVaccines"] = "Please select";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const RadioGroup = ({ field, options }: { field: string; options: { value: string; label: string }[] }) => (
    <div className="flex gap-4 mt-1">
      {options.map(opt => (
        <label key={opt.value} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
          (p as any)[field] === opt.value ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"
        }`}>
          <input
            type="radio"
            name={field}
            value={opt.value}
            checked={(p as any)[field] === opt.value}
            onChange={() => updateField("pet", field, opt.value)}
            className="accent-primary w-3.5 h-3.5"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Pet Information</h1>

      <div className="mb-8">
        <h2 className="form-section-title">
          <span className="text-muted-foreground mr-2">01</span>Pet Details
        </h2>
        <FormField section="pet" field="name" label="Pet Name" required placeholder="Pet's name" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormField section="pet" field="species" label="Species" required placeholder="e.g. Dog, Cat" />
          <FormField section="pet" field="breed" label="Breed" required placeholder="Breed" />
        </div>
        <FormField section="pet" field="dateOfBirth" label="Date of Birth" required type="date" />
        <FormField section="pet" field="colour" label="Colour" required placeholder="Colour / markings" />
        
        <div className="mb-5">
          <label className="form-label">Sex <span className="text-destructive">*</span></label>
          <RadioGroup field="sex" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
          {errors["pet.sex"] && <p className="form-error">{errors["pet.sex"]}</p>}
        </div>

        <div className="mb-5">
          <label className="form-label">Neutered <span className="text-destructive">*</span></label>
          <RadioGroup field="neutered" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
          {errors["pet.neutered"] && <p className="form-error">{errors["pet.neutered"]}</p>}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="form-section-title">
          <span className="text-muted-foreground mr-2">02</span>Microchip
        </h2>
        <FormField section="pet" field="microchipNumber" label="Microchip Number" required placeholder="15-digit number" maxLength={15} helper="Must be exactly 15 digits" />
        <FormField section="pet" field="microchipDate" label="Date of Implantation" required type="date" />
      </div>

      <div className="mb-8">
        <h2 className="form-section-title">
          <span className="text-muted-foreground mr-2">03</span>Vaccination Status
        </h2>
        <div className="mb-5">
          <label className="form-label">Up to date with routine vaccines? <span className="text-destructive">*</span></label>
          <RadioGroup field="routineVaccines" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
          {errors["pet.routineVaccines"] && <p className="form-error">{errors["pet.routineVaccines"]}</p>}
        </div>
      </div>

      <FormNavigation onNext={validate} />
    </div>
  );
};

export default PetInfoStep;
