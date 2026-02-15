import FormField from "@/components/FormField";
import FormNavigation from "@/components/FormNavigation";
import { useFormContext } from "@/contexts/FormContext";

const OwnerDetailsStep = () => {
  const { formData, errors, setErrors } = useFormContext();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const o = formData.owner;
    if (!o.firstName.trim()) e["owner.firstName"] = "First name is required";
    if (!o.lastName.trim()) e["owner.lastName"] = "Last name is required";
    if (!o.houseNameNumber.trim()) e["owner.houseNameNumber"] = "House name/number is required";
    if (!o.street.trim()) e["owner.street"] = "Street is required";
    if (!o.townCity.trim()) e["owner.townCity"] = "Town/City is required";
    if (!o.postalCode.trim()) e["owner.postalCode"] = "Postal code is required";
    if (!o.phone.trim()) e["owner.phone"] = "Phone number is required";
    if (!o.email.trim()) e["owner.email"] = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email)) e["owner.email"] = "Invalid email address";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstError = document.querySelector(".form-error");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(e).length === 0;
  };

  return (
    <div className="animate-fade-in">
      <h1 className="section-title">Owner Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <FormField section="owner" field="firstName" label="First Name" required placeholder="First name" />
        <FormField section="owner" field="lastName" label="Last Name" required placeholder="Last name" helper="Must match passport spelling exactly" />
      </div>

      <FormField section="owner" field="postalCode" label="Postcode" required placeholder="e.g. SW1A 1AA" />
      <FormField section="owner" field="houseNameNumber" label="House Name / Number" required placeholder="House name or number" />
      <FormField section="owner" field="street" label="Street" required placeholder="Street name" />
      <FormField section="owner" field="townCity" label="Town / City" required placeholder="Town or city" />
      <FormField section="owner" field="country" label="Country" required placeholder="Country" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <FormField section="owner" field="phone" label="Mobile Phone Number" required type="tel" placeholder="+44 7700 900000" />
        <FormField section="owner" field="email" label="Email Address" required type="email" placeholder="you@example.com" />
      </div>

      <FormNavigation onNext={validate} />
    </div>
  );
};

export default OwnerDetailsStep;
