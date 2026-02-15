import { useFormContext } from "@/contexts/FormContext";
import { CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.png";

const ConfirmationStep = () => {
  const { formData, resetForm, needsAuthorisedPerson } = useFormContext();

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    value ? <div className="flex justify-between py-1.5 border-b border-border/50 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div> : null
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Every Tail Vets" className="h-10 object-contain" />
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Form Submitted Successfully</h1>
        <p className="text-muted-foreground">Thank you. We will use this information to prepare your AHC before your appointment.</p>
      </div>

      <div className="summary-section">
        <h3 className="form-section-title">Owner Details</h3>
        <SummaryRow label="Name" value={`${formData.owner.firstName} ${formData.owner.lastName}`} />
        <SummaryRow label="Address" value={`${formData.owner.houseNameNumber} ${formData.owner.street}, ${formData.owner.townCity}, ${formData.owner.postalCode}`} />
        <SummaryRow label="Phone" value={formData.owner.phone} />
        <SummaryRow label="Email" value={formData.owner.email} />
      </div>

      <div className="summary-section">
        <h3 className="form-section-title">Transport</h3>
        <SummaryRow label="Transported By" value={formData.transport.transportedBy} />
        {formData.transport.carrierName && <SummaryRow label="Carrier" value={formData.transport.carrierName} />}
      </div>

      {needsAuthorisedPerson && (
        <div className="summary-section">
          <h3 className="form-section-title">Authorised Person</h3>
          <SummaryRow label="Name" value={`${formData.authorisedPerson.firstName} ${formData.authorisedPerson.lastName}`} />
          <SummaryRow label="Phone" value={formData.authorisedPerson.phone} />
          <SummaryRow label="Email" value={formData.authorisedPerson.email} />
        </div>
      )}

      <div className="summary-section">
        <h3 className="form-section-title">Pet Information</h3>
        <SummaryRow label="Name" value={formData.pet.name} />
        <SummaryRow label="Species" value={formData.pet.species} />
        <SummaryRow label="Breed" value={formData.pet.breed} />
        <SummaryRow label="DOB" value={formData.pet.dateOfBirth} />
        <SummaryRow label="Colour" value={formData.pet.colour} />
        <SummaryRow label="Sex" value={formData.pet.sex} />
        <SummaryRow label="Neutered" value={formData.pet.neutered} />
        <SummaryRow label="Microchip" value={formData.pet.microchipNumber} />
        <SummaryRow label="Vaccines Up to Date" value={formData.pet.routineVaccines} />
      </div>

      <div className="summary-section">
        <h3 className="form-section-title">Travel</h3>
        <SummaryRow label="Means" value={formData.travel.meansOfTravel === "car_ferry" ? "Car / Ferry" : "Air"} />
        <SummaryRow label="Entry Date" value={formData.travel.dateOfEntry} />
        <SummaryRow label="First Country" value={formData.travel.firstCountry} />
        <SummaryRow label="Final Destination" value={formData.travel.finalCountry} />
        <SummaryRow label="Tapeworm Treatment" value={formData.travel.tapewormRequired} />
        <SummaryRow label="Returning <5 days" value={formData.travel.returningWithinFiveDays} />
        <SummaryRow label="Returning <120 days" value={formData.travel.returningWithin120Days} />
      </div>

      <div className="summary-section">
        <h3 className="form-section-title">Rabies Vaccination</h3>
        <SummaryRow label="Date" value={formData.rabies.vaccinationDate} />
        <SummaryRow label="Vaccine" value={formData.rabies.vaccineName} />
        <SummaryRow label="Manufacturer" value={formData.rabies.manufacturer} />
        <SummaryRow label="Batch" value={formData.rabies.batchNumber} />
        <SummaryRow label="Valid From" value={formData.rabies.validFrom} />
        <SummaryRow label="Valid To" value={formData.rabies.validTo} />
      </div>

      <div className="summary-section">
        <h3 className="form-section-title">Declaration</h3>
        <SummaryRow label="Signature" value={formData.declaration.signature} />
        <SummaryRow label="Date" value={formData.declaration.date} />
      </div>

      <div className="flex justify-center pt-6 pb-10">
        <button onClick={resetForm} className="btn-primary">Start New Form</button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
