import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface FormData {
  owner: {
    firstName: string;
    lastName: string;
    houseNameNumber: string;
    street: string;
    townCity: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
  };
  transport: {
    transportedBy: "" | "owner" | "authorised" | "carrier";
    carrierName: string;
  };
  authorisedPerson: {
    firstName: string;
    lastName: string;
    houseNameNumber: string;
    street: string;
    townCity: string;
    postalCode: string;
    phone: string;
    email: string;
  };
  pet: {
    name: string;
    species: string;
    breed: string;
    dateOfBirth: string;
    colour: string;
    sex: string;
    neutered: string;
    microchipNumber: string;
    microchipDate: string;
    routineVaccines: string;
  };
  travel: {
    meansOfTravel: string;
    dateOfEntry: string;
    firstCountry: string;
    finalCountry: string;
    tapewormRequired: string;
    returningWithinFiveDays: string;
    returningWithin120Days: string;
  };
  rabies: {
    vaccinationDate: string;
    vaccineName: string;
    manufacturer: string;
    batchNumber: string;
    validFrom: string;
    validTo: string;
  };
  uploads: {
    rabiesCertificate: string | null;
    rabiesCertificateName: string;
  };
  declaration: {
    agreed: boolean;
    signature: string;
    printName: string;
    date: string;
  };
}

const defaultFormData: FormData = {
  owner: { firstName: "", lastName: "", houseNameNumber: "", street: "", townCity: "", postalCode: "", country: "United Kingdom", phone: "", email: "" },
  transport: { transportedBy: "", carrierName: "" },
  authorisedPerson: { firstName: "", lastName: "", houseNameNumber: "", street: "", townCity: "", postalCode: "", phone: "", email: "" },
  pet: { name: "", species: "", breed: "", dateOfBirth: "", colour: "", sex: "", neutered: "", microchipNumber: "", microchipDate: "", routineVaccines: "" },
  travel: { meansOfTravel: "", dateOfEntry: "", firstCountry: "", finalCountry: "", tapewormRequired: "", returningWithinFiveDays: "", returningWithin120Days: "" },
  rabies: { vaccinationDate: "", vaccineName: "", manufacturer: "", batchNumber: "", validFrom: "", validTo: "" },
  uploads: { rabiesCertificate: null, rabiesCertificateName: "" },
  declaration: { agreed: false, signature: "", printName: "", date: "" },
};

interface FormContextType {
  formData: FormData;
  updateField: (section: keyof FormData, field: string, value: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isSubmitted: boolean;
  setIsSubmitted: (v: boolean) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clearErrors: () => void;
  needsAuthorisedPerson: boolean;
  steps: StepConfig[];
  resetForm: () => void;
}

export interface StepConfig {
  id: string;
  title: string;
  shortTitle: string;
}

const ALL_STEPS: StepConfig[] = [
  { id: "intro", title: "Introduction", shortTitle: "Intro" },
  { id: "owner", title: "Owner Details", shortTitle: "Owner" },
  { id: "transport", title: "Pet Transport", shortTitle: "Transport" },
  { id: "authorised", title: "Authorised Person", shortTitle: "Auth. Person" },
  { id: "pet", title: "Pet Information", shortTitle: "Pet Info" },
  { id: "travel", title: "Travel Information", shortTitle: "Travel" },
  { id: "rabies", title: "Rabies Vaccination", shortTitle: "Rabies" },
  { id: "uploads", title: "Upload Documents", shortTitle: "Uploads" },
  { id: "declaration", title: "Declaration", shortTitle: "Declaration" },
  { id: "confirmation", title: "Confirmation", shortTitle: "Done" },
];

const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used within FormProvider");
  return ctx;
};

const STORAGE_KEY = "ahc-form-data";
const STEP_KEY = "ahc-form-step";

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
    } catch { return defaultFormData; }
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STEP_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const needsAuthorisedPerson = formData.transport.transportedBy === "authorised" || formData.transport.transportedBy === "carrier";

  const steps = ALL_STEPS.filter(s => {
    if (s.id === "authorised") return needsAuthorisedPerson;
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  useEffect(() => {
    try {
      localStorage.setItem(STEP_KEY, String(currentStep));
    } catch {}
  }, [currentStep]);

  const updateField = useCallback((section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section] as any, [field]: value },
    }));
    setErrors(prev => {
      const key = `${section}.${field}`;
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(0);
    setIsSubmitted(false);
    setErrors({});
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  }, []);

  return (
    <FormContext.Provider value={{ formData, updateField, currentStep, setCurrentStep, isSubmitted, setIsSubmitted, errors, setErrors, clearErrors, needsAuthorisedPerson, steps, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};
