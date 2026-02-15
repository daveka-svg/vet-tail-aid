import FormNavigation from "@/components/FormNavigation";
import logo from "@/assets/logo.png";
import { ClipboardCheck, Clock, Upload, FileText } from "lucide-react";

const IntroStep = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-8">
        <img src={logo} alt="Every Tail Vets" className="h-12 object-contain" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
        Animal Health Certificate
      </h1>
      <p className="text-center text-lg text-muted-foreground mb-10">
        Pre-Appointment Intake Form
      </p>

      <div className="reminder-box mb-8">
        <p className="text-sm leading-relaxed">
          Please complete this form at least <strong>3 days before</strong> your appointment. 
          The appointment lasts <strong>1 hour</strong>. A <strong>£125 non-refundable deposit</strong> is 
          required before booking.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="form-section-title">Key Reminders</h2>
        
        <div className="flex gap-3 items-start">
          <div className="mt-0.5 p-2 rounded-lg bg-secondary">
            <ClipboardCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm">Complete the form fully and accurately</p>
        </div>

        <div className="flex gap-3 items-start">
          <div className="mt-0.5 p-2 rounded-lg bg-secondary">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm">Submit at least 3 days before your appointment</p>
        </div>

        <div className="flex gap-3 items-start">
          <div className="mt-0.5 p-2 rounded-lg bg-secondary">
            <Upload className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm">Upload a copy of your rabies certificate if vaccination was done elsewhere</p>
        </div>

        <div className="flex gap-3 items-start">
          <div className="mt-0.5 p-2 rounded-lg bg-secondary">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm"><strong>Original documents must be brought to the appointment</strong></p>
        </div>
      </div>

      <FormNavigation nextLabel="Start Form" hideBack />
    </div>
  );
};

export default IntroStep;
