import FormField from "@/components/FormField";
import FormNavigation from "@/components/FormNavigation";
import { useFormContext } from "@/contexts/FormContext";
import { Upload, FileText, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";

const RabiesVaccinationStep = () => {
  const { formData, updateField, setErrors } = useFormContext();
  const r = formData.rabies;
  const [mode, setMode] = useState<"manual" | "upload">("manual");
  const [extracting, setExtracting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(formData.uploads.rabiesCertificateName || "");
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    // Store the file in uploads section
    const reader = new FileReader();
    reader.onload = () => {
      updateField("uploads", "rabiesCertificate", reader.result as string);
      updateField("uploads", "rabiesCertificateName", file.name);
    };
    reader.readAsDataURL(file);

    // Simulate extraction attempt (would be backend in production)
    setExtracting(true);
    setTimeout(() => {
      setExtracting(false);
      // In a real app, this would call an API to extract data from the certificate
      // For now, we show the fields for manual review/entry
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Rabies Vaccination</h1>

      {/* Mode toggle */}
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
            mode === "manual" ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
            mode === "upload" ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload & Extract
        </button>
      </div>

      {mode === "upload" && (
        <div className="mb-8">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-all bg-card mb-4"
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            {uploadedFileName ? (
              <p className="text-sm font-medium text-foreground">{uploadedFileName}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Click to upload rabies certificate</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG accepted</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} className="hidden" />

          {extracting && (
            <div className="reminder-box mb-4 text-sm">
              Attempting to extract vaccination details from your certificate…
            </div>
          )}

          {uploadedFileName && !extracting && (
            <div className="reminder-box mb-4 text-sm">
              Please review and complete the fields below. You can edit any pre-filled values.
            </div>
          )}
        </div>
      )}

      <FormField section="rabies" field="vaccinationDate" label="Date of Rabies Vaccination" required type="date" />
      <FormField section="rabies" field="vaccineName" label="Vaccine Name" required placeholder="e.g. Nobivac Rabies" />
      <FormField section="rabies" field="manufacturer" label="Manufacturer" required placeholder="Vaccine manufacturer" />
      <FormField section="rabies" field="batchNumber" label="Batch Number" required placeholder="Batch number" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <FormField section="rabies" field="validFrom" label="Validity FROM" required type="date" />
        <FormField section="rabies" field="validTo" label="Validity TO" required type="date" />
      </div>

      <div className="reminder-box flex gap-3 items-start mt-6">
        <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold mb-1">Important</p>
          <p className="text-sm">Original rabies vaccination documents must be brought to the appointment. Without these, we cannot issue the AHC.</p>
        </div>
      </div>

      <FormNavigation onNext={validate} />
    </div>
  );
};

export default RabiesVaccinationStep;
